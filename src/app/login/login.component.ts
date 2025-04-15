import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private loginService: LoginService) {} 

  onSubmit() {
    this.loginService.login(this.num_trabajador, this.contrasena).subscribe({
      next: (res) => {
        if (res.success) {
          this.mensaje = `Bienvenido ${res.auxiliar.nombre} ${res.auxiliar.apellidos}`;
          // puedes guardar los datos en localStorage, redirigir, etc.
        } else {
          this.mensaje = res.error;
        }
      },
      error: () => {
        this.mensaje = 'Error de conexión o credenciales incorrectas.';
      }
    });
  }
}
