import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interfaces para tipar las respuestas del backend
interface HabitacionResponse {
  success: boolean;
  message: string;
  habitacion: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface GenericResponse<T> {
  success: boolean;
  content: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // 🛏️ Obtener habitaciones con pacientes y registros (con paginación y búsqueda)
  getHabitaciones(page: number, limit: number, search: string = ''): Observable<HabitacionResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<HabitacionResponse>(`${this.apiUrl}/general`, { params }).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener habitaciones');
        }
        return {
          success: response.success,
          message: response.message,
          habitacion: response.habitacion || [],
          pagination: response.pagination || {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
          },
        };
      }),
      catchError((error) => {
        console.error('Error en getHabitaciones:', error);
        return throwError(() => new Error('No se pudieron cargar las habitaciones'));
      })
    );
  }

  // 🩺 Obtener datos personales del paciente
  getPatientPersonalData(habitacion: string): Observable<any> {
    return this.http.get<GenericResponse<any>>(`${this.apiUrl}/personal-data/${habitacion}`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener datos personales');
        }
        return response.content?.[0] || {};
      }),
      catchError((error) => {
        console.error('Error en getPatientPersonalData:', error);
        return throwError(() => new Error('No se pudieron cargar los datos personales del paciente'));
      })
    );
  }

  // 🩺 Obtener datos del paciente
  getPatientData(id: number): Observable<any> {
    return this.http.get<GenericResponse<any>>(`${this.apiUrl}/registro/${id}`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener datos del paciente');
        }
        return response.content || {};
      }),
      catchError((error) => {
        console.error('Error en getPatientData:', error);
        return throwError(() => new Error('No se pudieron cargar los datos del paciente'));
      })
    );
  }

  // 🧠 Obtener historial (diagnósticos) por paciente
  getDiagnosticoByPaciente(id: number): Observable<any[]> {
    return this.http.get<GenericResponse<any[]>>(`${this.apiUrl}/diagnostico/paciente/${id}`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener diagnósticos');
        }
        return response.content || [];
      }),
      catchError((error) => {
        console.error('Error en getDiagnosticoByPaciente:', error);
        return throwError(() => new Error('No se pudieron cargar los diagnósticos del paciente'));
      })
    );
  }

  // 🏥 Obtener datos generales de atención del paciente
  getCareDataByPaciente(id: number): Observable<any> {
    return this.http.get<GenericResponse<any>>(`${this.apiUrl}/registro/paciente/${id}`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener datos de atención');
        }
        return response.content || {};
      }),
      catchError((error) => {
        console.error('Error en getCareDataByPaciente:', error);
        return throwError(() => new Error('No se pudieron cargar los datos de atención del paciente'));
      })
    );
  }

  // 📊 Obtener historial de constantes vitales para gráficas
  getHistorialByPaciente(id: number): Observable<any[]> {
    return this.http.get<GenericResponse<any[]>>(`${this.apiUrl}/registro/paciente/historia/${id}`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener historial');
        }
        return response.content || [];
      }),
      catchError((error) => {
        console.error('Error en getHistorialByPaciente:', error);
        return throwError(() => new Error('No se pudo cargar el historial del paciente'));
      })
    );
  }

  // 🚨 Obtener alertas de todos los pacientes
  getAlertasByPaciente(): Observable<any[]> {
    return this.http.get<GenericResponse<{ alertas: any[] }>>(`${this.apiUrl}/alertas`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener alertas');
        }
        return response.content?.alertas || [];
      }),
      catchError((error) => {
        console.error('Error en getAlertasByPaciente:', error);
        return throwError(() => new Error('No se pudieron cargar las alertas'));
      })
    );
  }

  // 🛏️ Obtener habitaciones con dietas
  getAllDiets(): Observable<any> {
    return this.http.get<GenericResponse<any>>(`${this.apiUrl}/diets`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener dietas');
        }
        return response.content || {};
      }),
      catchError((error) => {
        console.error('Error en getAllDiets:', error);
        return throwError(() => new Error('No se pudieron cargar las dietas'));
      })
    );
  }

  // 🩺 Obtener datos médicos del paciente
  getMedicalPatientData(id: number): Observable<any> {
    return this.http.get<GenericResponse<any>>(`${this.apiUrl}/detalle_diagnostico/${id}`).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al obtener datos médicos');
        }
        return response.content || {};
      }),
      catchError((error) => {
        console.error('Error en getMedicalPatientData:', error);
        return throwError(() => new Error('No se pudieron cargar los datos médicos del paciente'));
      })
    );
  }

  // 🩺 Crear un nuevo detalle de diagnóstico
  createDetalleDiagnostico(payload: any): Observable<any> {
    return this.http.post<GenericResponse<any>>(`${this.apiUrl}/detalle_diagnostico`, payload).pipe(
      map((response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Error al crear detalle de diagnóstico');
        }
        return response.content || {};
      }),
      catchError((error) => {
        console.error('Error en createDetalleDiagnostico:', error);
        return throwError(() => new Error('No se pudo crear el detalle de diagnóstico'));
      })
    );
  }
}