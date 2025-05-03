import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContentComponent } from '../content/content.component';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, MenuComponent, HeaderComponent, ContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title = 'TCAI_FRONT_END';
}
