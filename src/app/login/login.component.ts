import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    this.loginService
      .login(this.num_trabajador, this.contrasena)
      .subscribe(() => {
        this.mensaje = this.loginService.getMensaje(); // Obtenemos el mensaje del servicio
      });
  }
}
