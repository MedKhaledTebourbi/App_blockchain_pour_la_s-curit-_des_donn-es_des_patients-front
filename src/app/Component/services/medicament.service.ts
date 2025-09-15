import { Injectable } from '@angular/core';
import { Medicament } from '../pharmacie/Medicament';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {

  private apiUrl = 'http://localhost:8085/medicament'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Ajouter un médicament
  addMedicament(medicament: Medicament): Observable<Medicament> {
    return this.http.post<Medicament>(`${this.apiUrl}/add`, medicament);
  }

  // Mettre à jour un médicament
  updateMedicament(medicament: Medicament): Observable<Medicament> {
    return this.http.put<Medicament>(`${this.apiUrl}/update`, medicament);
  }

  // Supprimer un médicament
  deleteMedicament(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Récupérer un médicament par ID
  getMedicamentById(id: number): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}/get/${id}`);
  }

  // Récupérer tous les médicaments
  getAllMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/getAll`);
  }

  // Récupérer les médicaments par pharmacie
  getMedicamentsByPharmacie(pharmacieId: number): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/pharmacie/${pharmacieId}`);
  }
}