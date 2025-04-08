import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {}
