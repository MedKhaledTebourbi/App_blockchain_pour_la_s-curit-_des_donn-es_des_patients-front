import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export class UserDTO
{

id!:number;
username!:string;
email!:string;
role!:string;
token!:string
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

   private baseUrl = 'http://localhost:8082/auth';

  constructor(private http: HttpClient) {}

  login(user: { username: string, password: string }): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/login`, user);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password?token=${token}`, { password: newPassword });
  }

  getCurrentUser(): Observable<UserDTO> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<UserDTO>(`${this.baseUrl}/me`, { headers });
  }
}

