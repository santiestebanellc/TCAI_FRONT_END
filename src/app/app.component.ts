import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PersonalDataComponent } from '../app/personal-data/personal-data.component';
import { MedicalDataDisplayComponent } from './medical-data-display/medical-data-display.component'; 
import { ButtonComponent } from './button/button.component';
import { ButtonIconComponent } from './button-icon/button-icon.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TCAI_FRONT_END';
}
