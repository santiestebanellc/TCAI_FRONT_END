import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8000'; 

  constructor(private http: HttpClient) {}

  // 🩺 Obtener datos del paciente
  getPatientData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registro/${id}`);
  }

  // 🧠 Obtener historial (diagnósticos) por paciente
  getDiagnosticoByPaciente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/diagnostico/paciente/${id}`);
  }

  // 🏥 Obtener datos generales de atención del paciente
  getCareDataByPaciente(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registro/${id}`);
  }

  // 🛏️ Obtener habitaciones con pacientes y registros
  getHabitaciones(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/general`);
  }

  
}


