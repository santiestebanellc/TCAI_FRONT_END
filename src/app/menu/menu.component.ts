import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientDataNavIconsComponent } from "../patient-data-nav-icons/patient-data-nav-icons.component";

@Component({
  selector: 'app-menu',
  imports: [RouterModule, PatientDataNavIconsComponent],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {}
