import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      this.patientDataSubject.next(JSON.parse(storedData));
    }
  }

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
    return this.http.get<any>(`${this.apiUrl}/registro/paciente/${id}`);
  }

  // 🛏️ Obtener habitaciones con pacientes y registros
  getHabitaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/general`);
  }

  // 🛏️ Obtener habitaciones con dietas
  getAllDiets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diets`);
  }

  // 🩺 Obtener datos de un paciente por su ID
  private patientDataSubject = new BehaviorSubject<{
    pacienteId: number;
    habitacionCodigo: string;
  } | null>(null);
  patientData$ = this.patientDataSubject.asObservable();

  setPatientData(pacienteId: number, habitacionCodigo: string): void {
    console.log('Setting patient data:', { pacienteId, habitacionCodigo });
    const data = { pacienteId, habitacionCodigo };
    localStorage.setItem('patientData', JSON.stringify(data));
    this.patientDataSubject.next(data);
  }

  clearPatientData(): void {
    localStorage.removeItem('patientData');
    this.patientDataSubject.next(null);
  }
}
