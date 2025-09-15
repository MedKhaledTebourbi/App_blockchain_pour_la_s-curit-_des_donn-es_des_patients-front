import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
export interface Docteur {
  idDocteur?: number;
  nom: string;
  specialite: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocteurService {
  private baseUrl = 'http://localhost:8088/docteur'; // adapte le port si besoin

  constructor(private http: HttpClient) {}

  getAll(): Observable<Docteur[]> {
    return this.http.get<Docteur[]>(`${this.baseUrl}/getAll`);
  }

  getById(id: number): Observable<Docteur> {
    return this.http.get<Docteur>(`${this.baseUrl}/get/${id}`);
  }

  add(docteur: Docteur): Observable<Docteur> {
    return this.http.post<Docteur>(`${this.baseUrl}/add`, docteur);
  }

  update(docteur: Docteur): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update`, docteur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
