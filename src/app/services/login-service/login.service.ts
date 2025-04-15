import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8000/login'; 

  constructor(private http: HttpClient) { }

  login(num_trabajador: string, contraseña: string): Observable<any> {
    const body = {
      num_trabajador,
      contraseña
    };

    return this.http.post(this.apiUrl, body);
  }
}
