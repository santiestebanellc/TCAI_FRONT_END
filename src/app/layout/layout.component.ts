import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentComponent } from '../content/content.component';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-layout',
  imports: [MenuComponent, HeaderComponent, ContentComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
