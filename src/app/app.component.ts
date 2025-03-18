import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserAlertIconsComponent } from  './user-alert-icons/user-alert-icons.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserAlertIconsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TCAI_FRONT_END';
}
