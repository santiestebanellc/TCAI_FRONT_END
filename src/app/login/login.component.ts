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
  loginCorrecto: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
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
        console.log('Error recibido:', error);
        this.loginCorrecto = false;
        this.mensaje = 'Error al conectar con el servidor.';
      },
    });
  }
}
