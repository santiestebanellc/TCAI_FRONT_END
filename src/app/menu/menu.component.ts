import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientDataNavIconsComponent } from '../patient-data-nav-icons/patient-data-nav-icons.component';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-menu',
  imports: [RouterModule, PatientDataNavIconsComponent],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  constructor(private loginService: LoginService) {}

  logOut() {
    this.loginService.logout();
  }
}
