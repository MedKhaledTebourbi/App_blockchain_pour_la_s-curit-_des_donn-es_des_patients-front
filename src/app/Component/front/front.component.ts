import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SmartContractService } from '../services/smart-contrat.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent {
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
    private contractService: SmartContractService, private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.patientId = +id;
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
        // On copie l’ordonnance récupérée
        this.ordonnance = { ...ordonnance };

        // Vérifier si medicament est une string JSON → parser en tableau
        if (typeof this.ordonnance.medicament === 'string') {
          try {
            const parsed = JSON.parse(this.ordonnance.medicament);
            this.ordonnance.medicament = parsed.medicaments ?? parsed;
          } catch (e) {
            console.error('Erreur parsing medicament', e);
            this.ordonnance.medicament = [];
          }
        }

        this.message = '';
      },
      error: () => {
        this.message = '❌ Aucune ordonnance trouvée pour ce patient';
        this.ordonnance = null;
      }
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
