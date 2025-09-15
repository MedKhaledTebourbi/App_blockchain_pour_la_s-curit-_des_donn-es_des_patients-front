import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';

export interface Patient {
  idPatient?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  email: string;
  telephone: string;
  adresse: string;
  numeroDossier: string;
  actif: boolean;
}

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  patients: Patient[] = [];

  newPatient: Patient = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    email: '',
    telephone: '',
    adresse: '',
    numeroDossier: '',
    actif: true
  };

  editMode: boolean = false;
  patientToEdit: Patient = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    email: '',
    telephone: '',
    adresse: '',
    numeroDossier: '',
    actif: true
  };

  constructor(private patientService: PatientService,private router: Router) {}
 goToSmartContract(patientId: number) {
    this.router.navigate(['/smartcontract', patientId]);
  }
  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe(data => {
      this.patients = data;
    });
  }

  savePatient() {
    this.patientService.savePatient(this.newPatient).subscribe(() => {
      this.loadPatients();
      this.resetForm();
    });
  }

  deletePatient(id: number) {
    this.patientService.deletePatient(id).subscribe(() => {
      this.loadPatients();
    });
  }

  editPatient(patient: Patient) {
    this.editMode = true;
    this.patientToEdit = { ...patient };
  }

  updatePatient() {
    if (!this.patientToEdit.idPatient) return;

    this.patientService.updatePatient(this.patientToEdit).subscribe(() => {
      this.loadPatients();
      this.cancelEdit();
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.patientToEdit = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      email: '',
      telephone: '',
      adresse: '',
      numeroDossier: '',
      actif: true
    };
  }

  resetForm() {
    this.newPatient = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      email: '',
      telephone: '',
      adresse: '',
      numeroDossier: '',
      actif: true
    };
  }
  getUsername(): string {
  return localStorage.getItem('username') || 'Utilisateur';
}

logout(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}

}
