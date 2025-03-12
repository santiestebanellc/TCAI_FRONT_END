import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoomCardComponent } from './room-card/room-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RoomCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TCAI_FRONT_END';
}
