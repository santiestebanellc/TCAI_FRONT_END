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
    // Si el formulari no és vàlid, mostrar errors
    if (loginForm.invalid) {
      this.loginCorrecto = false;
      if (!this.num_trabajador) {
        this.mensaje = 'Falta indicar l\'auxiliar.';
      } else if (!this.contrasena) {
        this.mensaje = 'Falta indicar la contrasenya.';
      } else {
        this.mensaje = 'Si us plau, omple tots els camps.';
      }
      return;
    }

    // Si és vàlid, netejar missatges i intentar fer login
    this.mensaje = '';
    this.loginService.login(this.num_trabajador, this.contrasena).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.loginCorrecto = true;
          this.mensaje = 'Contrasenya correcta. Redirigint...';
          setTimeout(() => {
            this.router.navigate(['/rooms/general']);
          }, 1000);
        } else {
          this.loginCorrecto = false;
          this.mensaje = res.error || 'Credencials incorrectes.';
        }
      },
      error: (error) => {
        console.log('Error rebut:', error);
        this.loginCorrecto = false;
        this.mensaje = 'Error en connectar amb el servidor.';
      },
    });
  }
}
