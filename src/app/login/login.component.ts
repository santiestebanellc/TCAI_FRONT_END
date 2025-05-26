import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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

  onSubmit(loginForm: NgForm) {
    // Si el formulario no es válido, no hacer nada y mostrar errores
    if (loginForm.invalid) {
      this.loginCorrecto = false;
      if (!this.num_trabajador) {
        this.mensaje = 'Falta el auxiliar';
      } else if (!this.contrasena) {
        this.mensaje = 'Falta contraseña';
      } else {
        this.mensaje = 'Por favor, rellena todos los campos.';
      }
      return;
    }

    // Si es válido, limpiar mensajes y hacer login
    this.mensaje = '';
    this.loginService.login(this.num_trabajador, this.contrasena).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.loginCorrecto = true;
          this.mensaje = 'Contraseña correcta. Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/rooms/general']);
          }, 1000);
        } else {
          this.loginCorrecto = false;
          this.mensaje = res.error || 'Credenciales incorrectas.';
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
