import { Component } from '@angular/core';
import { UserAlertIconsComponent } from '../user-alert-icons/user-alert-icons.component';

@Component({
  selector: 'app-header',
  imports: [UserAlertIconsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  pageTitle = 'General';
}
