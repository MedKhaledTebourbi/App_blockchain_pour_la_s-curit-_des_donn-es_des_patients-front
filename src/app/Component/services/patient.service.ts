import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8089/patient';

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/getall`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/get/${id}`);
  }

  savePatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/save`, patient);
  }

  updatePatient(patient: Patient): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  getPatientByNumeroDossier(numeroDossier: string): Observable<Patient> {
  return this.http.get<Patient>(`${this.apiUrl}/byNumeroDossier/${numeroDossier}`);
}

}
