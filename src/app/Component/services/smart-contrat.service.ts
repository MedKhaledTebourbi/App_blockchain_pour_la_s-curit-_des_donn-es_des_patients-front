import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrdonnanceDTO {
  id: number;
  patientId: number;
  nomPatient: string;
  maladie: string;
  medicament: string; // côté backend, ça reste une chaîne JSON
  docteur: string;
}

@Injectable({
  providedIn: 'root'
})
export class SmartContractService {

  private apiUrl = 'http://localhost:8083/smartcontract';

  constructor(private http: HttpClient) {}

  verifierCompatibiliteIA(maladie: string, medicament: string): Observable<any> {
    return this.http.post<any>('http://localhost:5001/verifier', { maladie, medicament });
  }

  // ✅ VERSION CORRIGÉE : envoie une liste de médicaments
  creerOrdonnance(
    patientId: number,
    nomPatient: string,
    maladie: string,
    medicaments: string[], // <-- tableau, pas une seule chaîne
    docteur: string
  ): Observable<boolean> {
    maladie = maladie.toLowerCase().trim();
    medicaments = medicaments.map(m => m.toLowerCase().trim());

    const body = { patientId, nomPatient, maladie, medicaments, docteur };
    return this.http.post<boolean>(`${this.apiUrl}/creer`, body);
  }

  verifierCompatibilite(maladie: string, medicament: string): Observable<boolean> {
    const params = new HttpParams()
      .set('maladie', maladie)
      .set('medicament', medicament);
    return this.http.get<boolean>(`${this.apiUrl}/verifier`, { params });
  }

  getOrdonnance(id: number): Observable<OrdonnanceDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<OrdonnanceDTO>(`${this.apiUrl}/get`, { params });
  }

  ajouterCompatibilite(maladie: string, medicament: string): Observable<void> {
    const params = new HttpParams()
      .set('maladie', maladie)
      .set('medicament', medicament);
    return this.http.post<void>(`${this.apiUrl}/ajouterCompatibilite`, null, { params });
  }

  getPatientByNomPrenom(nom: string, prenom: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8089/patient/search?nom=${nom}&prenom=${prenom}`);
  }

  getOrdonnanceByPatientId(patientId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8083/smartcontract/patient/${patientId}`);
  }

  getAllOrdonnances(): Observable<OrdonnanceDTO[]> {
    return this.http.get<OrdonnanceDTO[]>(`${this.apiUrl}/ordonnances`);
  }
  updateOrdonnance( ordonnance: OrdonnanceDTO): Observable<OrdonnanceDTO> {
  return this.http.put<OrdonnanceDTO>(`${this.apiUrl}/ordonnance/update`, ordonnance);
}

}
