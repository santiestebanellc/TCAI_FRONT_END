import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  nurseNumber: string = '';

  onSubmit() {
    if (this.nurseNumber) {
      console.log('Número de enfermero ingresado:', this.nurseNumber);
        // Pendiente hacer la logica
    }
  }
}