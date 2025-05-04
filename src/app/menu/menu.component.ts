import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientDataNavIconsComponent } from '../patient-data-nav-icons/patient-data-nav-icons.component';
import { ActualRoomService } from '../services/actual-room/actual-room.service';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-menu',
  imports: [
    RouterModule,
    PatientDataNavIconsComponent,
    AsyncPipe,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  actualRoom$: Observable<string | null>;
  constructor(
    private loginService: LoginService,
    private actualRoomService: ActualRoomService
  ) {
    this.actualRoom$ = this.actualRoomService.getActualRoom();
  }

  logOut() {
    this.loginService.logout();
  }
}
