import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // 🩺 Obtener datos personales del paciente por código de habitación
  getPatientPersonalData(habitacion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/personal-data/${habitacion}`).pipe(
      map((response) => response?.content?.[0] || {})
    );
  }

  // 🩺 Obtener datos del paciente por ID
  getPatientData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registro/${id}`);
  }

  // 🧠 Obtener historial (diagnósticos) del paciente
  getDiagnosticoByPaciente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/diagnostico/paciente/${id}`);
  }

  // 🏥 Obtener datos generales de atención del paciente
  getCareDataByPaciente(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registro/paciente/${id}`);
  }

  // 📊 Obtener historial de constantes vitales
  getHistorialByPaciente(id: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/registro/paciente/historia/${id}`).pipe(
      map((response) => response?.content || [])
    );
  }

  // 🚨 Obtener alertas de todos los pacientes
  getAlertasByPaciente(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/alertas`).pipe(
      map((response) => response?.content?.alertas || [])
    );
  }

  // 🛏️ Obtener habitaciones con pacientes y registros (paginado)
getHabitaciones(page: number = 1, limit: number = 16, search: string = ''): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());

  if (search.trim() !== '') {
    params = params.set('search', search.trim());
  }

  return this.http.get<any>(`${this.apiUrl}/general`, { params });
}


  // 🍽️ Obtener habitaciones con dietas
  getAllDiets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diets`);
  }

  // 🩺 Obtener detalle diagnóstico del paciente por ID
  getMedicalPatientData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalle_diagnostico/${id}`);
  }

  // 💾 Crear nuevo detalle diagnóstico
  createDetalleDiagnostico(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle_diagnostico`, payload);
  }

  /*
  // Si necesitas guardar estado local del paciente (comentado)
  // import { BehaviorSubject } from 'rxjs';
  private patientDataSubject = new BehaviorSubject<{
    pacienteId: number;
    habitacionCodigo: string;
  } | null>(null);
  patientData$ = this.patientDataSubject.asObservable();

  setPatientData(pacienteId: number, habitacionCodigo: string): void {
    const data = { pacienteId, habitacionCodigo };
    localStorage.setItem('patientData', JSON.stringify(data));
    this.patientDataSubject.next(data);
  }

  clearPatientData(): void {
    localStorage.removeItem('patientData');
    this.patientDataSubject.next(null);
  }
  */
}
