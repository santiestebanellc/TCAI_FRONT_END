import { Component } from '@angular/core';

@Component({
  selector: 'app-user-alert-icons',
  imports: [],
  templateUrl: './user-alert-icons.component.html',
  styleUrl: './user-alert-icons.component.css',
})
export class UserAlertIconsComponent {
  nombre =
    localStorage.getItem('userNombre') +
    ' ' +
    localStorage.getItem('userApellidos');
  numTrabajador = localStorage.getItem('numTrabajador');
}
