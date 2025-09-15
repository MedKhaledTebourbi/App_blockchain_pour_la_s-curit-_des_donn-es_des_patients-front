import { Component, OnInit } from '@angular/core';
import { PharmacieService } from '../services/pharmacie.service';
import { Pharmacie } from '../pharmacie/Pharmacie';
import { PatientService } from '../services/patient.service';
import { SmartContractService } from '../services/smart-contrat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pharmacie',
  templateUrl: './pharmacie.component.html',
  styleUrls: ['./pharmacie.component.css']
})
export class PharmacieComponent implements OnInit {

   nom: string = '';
  prenom: string = '';
  ordonnance: any;

  incompatibilite: boolean = false;
  incompatibles: string[][] = [];
  indisponibles: string[] = [];
  resultat: string = '';

  constructor(
    private smartService: SmartContractService,
    private pharmacieService: PharmacieService, private router: Router
    
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  verifierOrdonnance() {
    // Étape 1 : trouver le patient par nom + prénom
    this.smartService.getPatientByNomPrenom(this.nom, this.prenom).subscribe(patient => {
      if (!patient || !patient.idPatient) {
        this.resultat = "❌ Patient introuvable.";
        return;
      }

      // Étape 2 : récupérer l’ordonnance
      this.smartService.getOrdonnanceByPatientId(patient.idPatient).subscribe(ordonnance => {
        this.ordonnance = ordonnance;

        const medicaments: string[] = JSON.parse(ordonnance.medicament);

        // Étape 3 : vérifier compatibilité entre médicaments via microservice IA
        this. pharmacieService.verifierCombinaison(medicaments).subscribe(resIa => {
          this.incompatibilite = resIa.danger;
          this.incompatibles = resIa.incompatibles;

          // Étape 4 : vérifier disponibilité en pharmacie (ici pharmacieId = 1 par ex.)
          const pharmacieId = 1; // ⚠️ adapte selon ta logique
          this.pharmacieService.checkDisponibilite(pharmacieId, medicaments).subscribe(res => {
            this.indisponibles = res.indisponibles;

            // Étape 5 : générer message final
            if (this.incompatibilite) {
              this.resultat =
                "⚠️ Attention : certains médicaments sont incompatibles : " +
                this.incompatibles.map(pair => pair.join(" + ")).join(", ");
            } else if (this.indisponibles.length > 0) {
              this.resultat =
                "❌ Médicaments manquants en stock : " +
                this.indisponibles.join(', ');
            } else {
              this.resultat = "✅ Ordonnance validée et disponible en pharmacie.";
            }
          });
        });
      });
    });
  }
      getUsername(): string {
  return localStorage.getItem('username') || 'Utilisateur';
}

logout(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}
}
