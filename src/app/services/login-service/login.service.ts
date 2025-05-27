import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

interface LoginResponse {
  success: boolean;
  auxiliar?: {
    nombre: string;
    apellidos: string;
    num_trabajador: string;
    id?: number;
  };
  error?: string;
}

interface UserData {
  auxiliar?: {
    nombre: string;
    apellidos: string;
    num_trabajador: string;
    id?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private mensaje: string = '';
  private isLoggedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  ); // Inicializa con el estado actual
  isLogged$ = this.isLoggedSubject.asObservable();
  private apiUrl = 'http://localhost:8000/login';

  constructor(private http: HttpClient, private router: Router) {}

 login(num_trabajador: string, contrasena: string): Observable<LoginResponse> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  return this.http.post<LoginResponse>(this.apiUrl, { num_trabajador, contrasena }, httpOptions).pipe(
    tap((res) => {
      if (res.success && res.auxiliar) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userNombre', res.auxiliar.nombre);
        localStorage.setItem('userApellidos', res.auxiliar.apellidos);
        localStorage.setItem('numTrabajador', res.auxiliar.num_trabajador);
        localStorage.setItem('userId', String(res.auxiliar.id));
        this.isLoggedSubject.next(true);
      }
    }),
    catchError(() => {
      this.mensaje = 'Auxiliar o la contrasenya estan malament';
      return of({ success: false, error: this.mensaje });
    })
  );
}


  getMensaje(): string {
    return this.mensaje;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('userApellidos');
    localStorage.removeItem('numTrabajador');
    this.isLoggedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getUserData(): UserData | null {
    const userNombre = localStorage.getItem('userNombre');
    const userApellidos = localStorage.getItem('userApellidos');
    const numTrabajador = localStorage.getItem('numTrabajador');
    const userId = localStorage.getItem('userId');

    if (userNombre && userApellidos && numTrabajador) {
      const userData: UserData = {
        auxiliar: {
          nombre: userNombre,
          apellidos: userApellidos,
          num_trabajador: numTrabajador,
          id: userId ? parseInt(userId, 10) : undefined,
        },
      };
      return userData;
    }

    return null;
  }
}
