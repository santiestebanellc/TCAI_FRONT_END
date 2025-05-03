import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-empty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-empty.component.html',
  styleUrls: ['./card-empty.component.css']
})
export class CardEmptyComponent {
  @Input() habitacion: any;
}

