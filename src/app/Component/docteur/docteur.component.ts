import { Component, OnInit } from '@angular/core';
import { DocteurService } from '../services/docteur.service';
import { Router } from '@angular/router';
export interface Docteur {
  idDocteur?: number;
  nom: string;
  specialite: string;
  email: string;
}


@Component({
  selector: 'app-docteur',
  templateUrl: './docteur.component.html',
  styleUrls: ['./docteur.component.css']
})
export class DocteurComponent  implements OnInit{
 docteurs: Docteur[] = [];
  newDocteur: Docteur = { nom: '', specialite: '', email: '' };
  editMode: boolean = false;
  docteurToEdit: Docteur = { nom: '', specialite: '', email: '' };

  constructor(private docteurService: DocteurService, private router: Router) {}

  ngOnInit(): void {
    this.getAllDocteurs();
  }

  getAllDocteurs(): void {
    this.docteurService.getAll().subscribe(data => this.docteurs = data);
  }

  addDocteur(): void {
    this.docteurService.add(this.newDocteur).subscribe(() => {
      this.getAllDocteurs();
      this.newDocteur = { nom: '', specialite: '', email: '' };
    });
  }

  editDocteur(docteur: Docteur): void {
    this.editMode = true;
    this.docteurToEdit = { ...docteur };
  }

  updateDocteur(): void {
    if (this.docteurToEdit.idDocteur !== undefined) {
      this.docteurService.update(this.docteurToEdit).subscribe(() => {
        this.getAllDocteurs();
        this.editMode = false;
        this.docteurToEdit = { nom: '', specialite: '', email: '' };
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.docteurToEdit = { nom: '', specialite: '', email: '' };
  }

  deleteDocteur(id: number | undefined): void {
    if (id !== undefined) {
      this.docteurService.delete(id).subscribe(() => this.getAllDocteurs());
    }
  }
    getUsername(): string {
  return localStorage.getItem('username') || 'Utilisateur';
}

logout(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}
}
