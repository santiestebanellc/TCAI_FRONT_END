import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PersonalDataComponent } from '../app/personal-data/personal-data.component';
import { MedicalDataDisplayComponent } from './medical-data-display/medical-data-display.component'; 
import { ButtonComponent } from './button/button.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HeaderTitleComponent } from './header-title/header-title.component';
import { HistoricalComponent } from './historical/historical.component';
import { CareDataSummaryComponent } from './care-data-summary/care-data-summary.component';
import { MedicalDataFormComponent } from './medical-data-form/medical-data-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MedicalDataFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TCAI_FRONT_END';
}
