import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getRegistrosByPaciente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/registro/paciente/${id}`);
  }
}
