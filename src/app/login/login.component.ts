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

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.num_trabajador, this.contrasena).subscribe({
      next: (isLogged) => {
        if (isLogged) {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        // Manejo de errores
        this.mensaje = 'Error al iniciar sesión: ' + error.message;
      },
    });
  }
}
