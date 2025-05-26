import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeLoader } from '../../types/TypeLoader';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // 🩺 Obtener datos personales del paciente por código de habitación
  getPatientPersonalData(habitacion: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/personal-data/${habitacion}`)
      .pipe(map((response) => response?.content?.[0] || {}));
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
    return this.http
      .get<any>(`${this.apiUrl}/registro/paciente/historia/${id}`)
      .pipe(map((response) => response?.content || []));
  }

  // 🚨 Obtener alertas de todos los pacientes
  getAlertasByPaciente(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/alertas`)
      .pipe(map((response) => response?.content?.alertas || []));
  }

  // 🛏️ Obtener habitaciones con pacientes y registros (paginado)
  getHabitaciones(
    page: number = 1,
    limit: number = 16,
    search: string = ''
  ): Observable<any> {
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

  createCareData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/paciente/registro/`, data);
  }

  // GET TIPOS
  getTipoHigiene(): Observable<TypeLoader[]> {
    return this.http
      .get<{ content: TypeLoader[]; success: boolean }>(
        `${this.apiUrl}/tipo/higiene/`
      )
      .pipe(map((response) => response.content));
  }

  getTipoDieta(): Observable<TypeLoader[]> {
    return this.http
      .get<{ content: TypeLoader[]; success: boolean }>(
        `${this.apiUrl}/tipo/dieta/`
      )
      .pipe(map((response) => response.content));
  }

  getTipoTextura(): Observable<TypeLoader[]> {
    return this.http
      .get<{ content: TypeLoader[]; success: boolean }>(
        `${this.apiUrl}/tipo/textura/`
      )
      .pipe(map((response) => response.content));
  }
}
