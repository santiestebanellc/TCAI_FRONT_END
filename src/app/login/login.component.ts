import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  num_trabajador: string = '';
  contrasena: string = '';
  mensaje: string = '';
  loginCorrecto: boolean = false; // Added missing property

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    // Validaciones previas
    if (!this.num_trabajador) {
      this.loginCorrecto = false;
      this.mensaje = 'Falta el auxiliar';
      return;
    }
    
    if (!this.contrasena) {
      this.loginCorrecto = false;
      this.mensaje = 'Falta contraseña';
      return;
    }

    this.loginService.login(this.num_trabajador, this.contrasena).subscribe({
      next: (isLogged: boolean) => {
        if (isLogged) {
          this.loginCorrecto = true;
          this.mensaje = 'Contraseña correcta. Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/rooms/general']);
          }, 1000);
        } else {
          this.loginCorrecto = false;
          this.mensaje = 'Contraseña incorrecta.';
        }
      },
      error: (error) => {
        this.loginCorrecto = false;
        // Verificar si el error es porque el auxiliar no existe
        if (error.status === 404 || error.error?.message?.includes('no existe')) {
          this.mensaje = 'No existe este auxiliar';
        } else {
          this.mensaje = 'Error al conectar con el servidor.';
        }
      },
    });
  }
}