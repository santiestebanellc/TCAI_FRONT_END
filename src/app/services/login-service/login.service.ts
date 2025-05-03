import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

interface LoginResponse {
  success: boolean;
  auxiliar?: {
    nombre: string;
    apellidos: string;
  };
  error?: string;
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

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(this.apiUrl, { username, password })
      .pipe(
        tap((res) => {
          if (res.success && res.auxiliar) {
            this.mensaje = `Bienvenido ${res.auxiliar.nombre} ${res.auxiliar.apellidos}`;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userNombre', res.auxiliar.nombre);
            localStorage.setItem('userApellidos', res.auxiliar.apellidos);
            this.isLoggedSubject.next(true);
            this.router.navigate(['/list-all-nurses']);
          } else {
            this.mensaje = res.error || 'Credenciales incorrectas.';
          }
        }),
        map((res) => res.success), // <-- Aquí se transforma a boolean
        catchError(() => {
          this.mensaje = 'Error de conexión o del servidor.';
          return of(false);
        })
      );
  }

  getMensaje(): string {
    return this.mensaje;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    this.isLoggedSubject.next(false);
    this.router.navigate(['/home']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}
