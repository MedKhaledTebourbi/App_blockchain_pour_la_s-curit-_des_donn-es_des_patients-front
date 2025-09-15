import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pharmacie } from '../pharmacie/Pharmacie';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacieService {
 private apiUrlj = 'http://localhost:5001';
  private apiUrl = 'http://localhost:8085/pharmacie'; // adapte le port si besoin

  constructor(private http: HttpClient) {}

  // Ajouter une pharmacie
  addPharmacie(pharmacie: Pharmacie): Observable<Pharmacie> {
    return this.http.post<Pharmacie>(`${this.apiUrl}/add`, pharmacie);
  }

  // Mettre à jour une pharmacie
  updatePharmacie(pharmacie: Pharmacie): Observable<Pharmacie> {
    return this.http.put<Pharmacie>(`${this.apiUrl}/update`, pharmacie);
  }

  // Supprimer une pharmacie
  deletePharmacie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Récupérer une pharmacie par ID
  getPharmacieById(id: number): Observable<Pharmacie> {
    return this.http.get<Pharmacie>(`${this.apiUrl}/get/${id}`);
  }

  // Récupérer toutes les pharmacies
  getAllPharmacies(): Observable<Pharmacie[]> {
    return this.http.get<Pharmacie[]>(`${this.apiUrl}/getAll`);
  }
  checkDisponibilite(pharmacieId: number, medicaments: string[]): Observable<{ indisponibles: string[] }> {
    return this.http.post<{ indisponibles: string[] }>(
      `${this.apiUrl}/checkDisponibilite/${pharmacieId}`,
      medicaments
    );
  }
  verifierCombinaison(medicaments: string[]): Observable<{ danger: boolean, incompatibles: string[][] }> {
    return this.http.post<{ danger: boolean, incompatibles: string[][] }>(
      `${this.apiUrlj}/verifier_combinaison`,
      { medicaments }
    );
  }
}