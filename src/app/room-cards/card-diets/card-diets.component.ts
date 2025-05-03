import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-diets',
  imports: [CommonModule],
  templateUrl: './card-diets.component.html',
  styleUrl: './card-diets.component.css',
})
export class CardDietsComponent {
  @Input() habitacion: any;
}
