import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PersonalDataComponent } from '../app/personal-data/personal-data.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PersonalDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TCAI_FRONT_END';
}
