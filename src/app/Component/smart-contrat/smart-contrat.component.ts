import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdonnanceDTO, SmartContractService } from '../services/smart-contrat.service';

@Component({
  selector: 'app-smart-contrat',
  templateUrl: './smart-contrat.component.html',
  styleUrls: ['./smart-contrat.component.css']
})
export class SmartContratComponent implements OnInit {
  patientIdRecherche!: number;
  allOrdonnances: OrdonnanceDTO[] = [];

  patientId!: number;
  nomPatient = '';
  maladie = '';
  medicaments: string[] = [];
  medicamentInput = '';
  docteur = '';
  message = '';
  ordonnance: any;
  nomRecherche = '';
  prenomRecherche = '';

  constructor(
    private route: ActivatedRoute,
    private contractService: SmartContractService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.patientId = +id;
      }
    });
  }

  ajouterMedicament() {
  const medicament = this.medicamentInput?.trim().toLowerCase();

  if (!medicament) {
    this.message = '❌ Veuillez saisir un médicament';
    return;
  }

  if (!this.maladie) {
    this.message = '❌ Veuillez d\'abord saisir une maladie pour vérifier la compatibilité';
    return;
  }

  this.contractService.verifierCompatibiliteIA(this.maladie.toLowerCase(), medicament).subscribe({
    next: (res) => {
      if (res.compatible) {
        this.medicaments.push(medicament);
        this.medicamentInput = ''; // Réinitialiser le champ
        this.message = `✅ Médicament "${medicament}" ajouté avec succès`;
      } else {
        this.message = `❌ Médicament "${medicament}" incompatible avec la maladie selon l'IA`;
      }
    },
    error: (err) => {
      console.error(err);
      this.message = '❌ Erreur lors de la vérification de compatibilité IA';
    }
  });
}


  creerOrdonnance() {
  if (!this.patientId) {
    this.message = '❌ ID patient manquant';
    return;
  }
  if (!this.nomPatient || !this.maladie || this.medicaments.length === 0 || !this.docteur) {
    this.message = '❌ Veuillez remplir tous les champs';
    return;
  }

  const maladie = this.maladie.toLowerCase().trim();
  const medicamentsFormattes = this.medicaments.map(m => m.toLowerCase().trim());

  // Vérification via le smart contract
  const verificationsBlockchain = medicamentsFormattes.map(medicament =>
    this.contractService.verifierCompatibilite(maladie, medicament).toPromise()
  );

  // Vérification via l'IA
  const verificationsIA = medicamentsFormattes.map(medicament =>
    this.contractService.verifierCompatibiliteIA(maladie, medicament).toPromise()
  );

  // Attendre toutes les vérifications
  Promise.all([Promise.all(verificationsBlockchain), Promise.all(verificationsIA)])
    .then(([resultBlockchain, resultIA]) => {
      const incompatiblesBC = resultBlockchain
        .map((res, i) => (res ? null : this.medicaments[i]))
        .filter(m => m !== null);

      const incompatiblesIA = resultIA
        .map((res, i) => (res.compatible ? null : this.medicaments[i])) // si le backend renvoie {compatible: true/false}
        .filter(m => m !== null);

      // Fusionner les erreurs
      const incompatiblesTotal = Array.from(new Set([...incompatiblesBC, ...incompatiblesIA]));

      if (incompatiblesTotal.length > 0) {
        let msg = `❌ Médicament(s) incompatible(s) détecté(s) : ${incompatiblesTotal.join(', ')}`;
        if (incompatiblesBC.length > 0) msg += ' (via Blockchain)';
        if (incompatiblesIA.length > 0) msg += ' (via IA)';
        this.message = msg;
      } else {
        const medicamentsJson = JSON.stringify(medicamentsFormattes);
        this.creerOrdonnanceFinale(maladie, medicamentsJson);
      }
    })
    .catch(error => {
      console.error(error);
      this.message = '❌ Erreur lors de la vérification des compatibilités';
    });
}


  private creerOrdonnanceFinale(maladie: string, medicamentsJson: string) {
    this.contractService.creerOrdonnance(this.patientId, this.nomPatient, maladie,JSON.parse(medicamentsJson), this.docteur)
      .subscribe({
        next: () => {
          this.message = '✅ Ordonnance créée avec succès';
          this.nomPatient = '';
          this.maladie = '';
          this.medicaments = [];
          this.docteur = '';
        },
        error: err => {
          this.message = '❌ Erreur création ordonnance : ' + (err.error?.message || err.message);
        }
      });
  }

  verifier() {
    if (!this.maladie || this.medicaments.length === 0) {
      this.message = '❌ Veuillez saisir maladie et médicament à vérifier';
      return;
    }
    const medicament = this.medicaments[0];
    this.contractService.verifierCompatibilite(this.maladie, medicament).subscribe({
      next: res => {
        this.message = res ? '✅ Compatible' : '❌ Incompatible';
      },
      error: () => {
        this.message = '❌ Erreur de vérification';
      }
    });
  }

  ajouterCompatibilite() {
    const medicament = this.medicaments[0] || '';
    if (!this.maladie || !medicament) {
      this.message = '❌ Veuillez saisir maladie et médicament à ajouter';
      return;
    }
    this.contractService.ajouterCompatibilite(this.maladie, medicament).subscribe({
      next: () => {
        this.message = '✅ Compatibilité ajoutée';
      },
      error: () => {
        this.message = '❌ Erreur ajout compatibilité';
      }
    });
  }

  rechercherOrdonnanceParNomPrenom() {
    if (!this.nomRecherche || !this.prenomRecherche) {
      this.message = '❌ Veuillez saisir le nom et le prénom du patient';
      return;
    }

    this.contractService.getPatientByNomPrenom(this.nomRecherche, this.prenomRecherche).subscribe({
      next: (patient) => {
        if (patient && patient.idPatient) {
          this.getOrdonnance(patient.idPatient);
        } else {
          this.message = '❌ Patient non trouvé';
          this.ordonnance = null;
        }
      },
      error: () => {
        this.message = '❌ Erreur lors de la recherche du patient';
        this.ordonnance = null;
      }
    });
  }

  getOrdonnance(patientId: number) {
    this.contractService.getOrdonnanceByPatientId(patientId).subscribe({
      next: (ordonnance) => {
        this.ordonnance = ordonnance;
        this.message = '';
      },
      error: () => {
        this.message = '❌ Aucune ordonnance trouvée pour ce patient';
        this.ordonnance = null;
      }
    });
  }

  getAllOrdonnances() {
    this.contractService.getAllOrdonnances().subscribe({
      next: (data) => {
        this.allOrdonnances = data;
        this.message = `✅ ${data.length} ordonnance(s) récupérée(s).`;
      },
      error: (err) => {
        console.error(err);
        this.message = "❌ Erreur lors de la récupération des ordonnances.";
      }
    });
  }
}
