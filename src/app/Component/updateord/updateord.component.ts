import { Component } from '@angular/core';
import { PatientService, Patient } from '../services/patient.service';
import { SmartContractService, OrdonnanceDTO } from '../services/smart-contrat.service';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-updateord',
  templateUrl: './updateord.component.html',
  styleUrls: ['./updateord.component.css']
})
export class UpdateordComponent {
 numeroDossier: string = '';
  patient?: Patient;
  ordonnance?: OrdonnanceDTO;
  erreur: string = '';
  succes: string = '';

  // Champs modifiables
  maladieModifiee: string = '';
  medicamentModifie: string = '';
  docteurModifie: string = '';
patientId!: number;
  nomPatient = '';
  maladie = '';
  medicaments: string[] = [];
  medicamentInput = '';
  docteur = '';
  message = '';
 
  nomRecherche = '';
  prenomRecherche = '';
  constructor(
    private patientService: PatientService,
    private smartContractService: SmartContractService,
    private contractService: SmartContractService
  ) {}

  rechercherEtAfficherOrdonnance() {
    this.erreur = '';
    this.succes = '';
    this.ordonnance = undefined;
    this.patient = undefined;

    if (!this.numeroDossier.trim()) {
      this.erreur = 'Veuillez entrer un numéro de dossier.';
      return;
    }

    this.patientService.getPatientByNumeroDossier(this.numeroDossier.trim())
      .subscribe({
        next: (p) => {
          this.patient = p;
          this.smartContractService.getOrdonnanceByPatientId(p.idPatient!)
            .subscribe({
              next: (ordonnance) => {
                this.ordonnance = ordonnance;

                // Initialiser les champs modifiables
                this.maladieModifiee = ordonnance.maladie;
                this.medicamentModifie = ordonnance.medicament;
                this.docteurModifie = ordonnance.docteur;
              },
              error: () => {
                this.erreur = "Aucune ordonnance trouvée pour ce patient.";
              }
            });
        },
        error: () => {
          this.erreur = "Patient introuvable avec ce numéro de dossier.";
        }
      });
  }

modifierOrdonnance() {
  this.erreur = '';
  this.succes = '';

  if (!this.patient || !this.patient.idPatient) {
    this.erreur = '❌ ID patient manquant.';
    return;
  }

  if (!this.maladieModifiee || this.medicaments.length === 0 || !this.docteurModifie) {
    this.erreur = '❌ Veuillez remplir tous les champs.';
    return;
  }

  const maladie = this.maladieModifiee.toLowerCase().trim();

  // Vérifications via Blockchain et IA
  const verificationsBlockchain = this.medicaments.map(med =>
    this.smartContractService.verifierCompatibilite(maladie, med).toPromise()
  );

  const verificationsIA = this.medicaments.map(med =>
    this.smartContractService.verifierCompatibiliteIA(maladie, med).toPromise()
  );

  Promise.all([Promise.all(verificationsBlockchain), Promise.all(verificationsIA)])
    .then(([resultBlockchain, resultIA]: [(boolean | undefined)[], ({ compatible?: boolean } | undefined)[]]) => {
      const incompatiblesBC = resultBlockchain
        .map((res, i) => (res ? null : this.medicaments[i]))
        .filter((m): m is string => m !== null);

      const incompatiblesIA = resultIA
        .map((res, i) => (res?.compatible ? null : this.medicaments[i]))
        .filter((m): m is string => m !== null);

      const incompatiblesTotal = Array.from(new Set([...incompatiblesBC, ...incompatiblesIA]));

      if (incompatiblesTotal.length > 0) {
        let msg = `❌ Médicament(s) incompatible(s) détecté(s) : ${incompatiblesTotal.join(', ')}`;
        if (incompatiblesBC.length > 0) msg += ' (via Blockchain)';
        if (incompatiblesIA.length > 0) msg += ' (via IA)';
        this.erreur = msg;
      } else {
        const ordonnanceModifiee: OrdonnanceDTO = {
          id: this.ordonnance?.id ?? 0,
          patientId: this.patient!.idPatient!,
          nomPatient: this.patient!.nom,
          maladie: maladie,
          docteur: this.docteurModifie.trim(),
          medicament: JSON.stringify(this.medicaments) // ✅ stockage en JSON
        };

        this.smartContractService.updateOrdonnance(ordonnanceModifiee).subscribe({
          next: () => {
            this.succes = '✅ Ordonnance modifiée avec succès.';
            this.rechercherEtAfficherOrdonnance();
          },
          error: () => {
            this.erreur = '❌ Erreur lors de la modification.';
          }
        });
      }
    })
    .catch(error => {
      console.error(error);
      this.erreur = '❌ Erreur lors de la vérification des compatibilités.';
    });
}

ajouterMedicament() {
  const medicament = this.medicamentInput?.trim().toLowerCase();

  if (!medicament) {
    this.message = '❌ Veuillez saisir un médicament';
    return;
  }

  if (!this.maladieModifiee) {
    this.message = '❌ Veuillez d\'abord saisir une maladie pour vérifier la compatibilité';
    return;
  }

  // Utiliser maladieModifiee comme maladie de référence
  this.smartContractService.verifierCompatibiliteIA(this.maladieModifiee.toLowerCase(), medicament).subscribe({
    next: (res) => {
      if (res.compatible) {
        if (!this.medicaments.includes(medicament)) {
          this.medicaments.push(medicament);
          this.medicamentInput = ''; // Réinitialiser le champ
          this.message = `✅ Médicament "${medicament}" ajouté avec succès`;
        } else {
          this.message = `⚠️ Médicament "${medicament}" est déjà dans la liste`;
        }
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



}
