import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {
    // const storedData = localStorage.getItem('patientData');
    // if (storedData) {
    //   this.patientDataSubject.next(JSON.parse(storedData));
    // }
  }

  // 🩺 Obtener datos personales del paciente
  getPatientPersonalData(habitacion: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/personal-data/${habitacion}`)
      .pipe(
        map((response) => {
          // Devuelve el primer paciente del array "content" si existe
          return response?.content?.[0] || {};
        })
      );
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

  // 📊 Obtener historial de constantes vitales para gráficas
  getHistorialByPaciente(id: number): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/registro/paciente/historia/${id}`)
      .pipe(map((response) => response?.content || []));
  }

  // 🛏️ Obtener habitaciones con pacientes y registros
  getHabitaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/general`);
  }

  // 🛏️ Obtener habitaciones con dietas
  getAllDiets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diets`);
  }

  // // 🩺 Obtener datos de un paciente por su ID
  // private patientDataSubject = new BehaviorSubject<{
  //   pacienteId: number;
  //   habitacionCodigo: string;
  // } | null>(null);
  // patientData$ = this.patientDataSubject.asObservable();

  // 🩺 Obtener datos del paciente
  getMedicalPatientData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalle_diagnostico/${id}`);
  }

  // // 🩺 Obtener datos de un paciente por su ID
  // private patientDataSubject = new BehaviorSubject<{
  //   pacienteId: number;
  //   habitacionCodigo: string;
  // } | null>(null);
  // patientData$ = this.patientDataSubject.asObservable();

  // setPatientData(pacienteId: number, habitacionCodigo: string): void {
  //   console.log('Setting patient data:', { pacienteId, habitacionCodigo });
  //   const data = { pacienteId, habitacionCodigo };
  //   localStorage.setItem('patientData', JSON.stringify(data));
  //   this.patientDataSubject.next(data);
  // }

  // clearPatientData(): void {
  //   localStorage.removeItem('patientData');
  //   this.patientDataSubject.next(null);
  // }

  createDetalleDiagnostico(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle_diagnostico`, payload);
  }

  createCareData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle_diagnostico/`, data);
  }
}
