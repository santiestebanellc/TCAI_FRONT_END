import { Component } from '@angular/core';
import { HeaderTitleComponent } from '../header-title/header-title.component';
import { UserAlertIconsComponent } from '../user-alert-icons/user-alert-icons.component';

@Component({
  selector: 'app-header',
  imports: [UserAlertIconsComponent, HeaderTitleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  pageTitle = 'General';
}
