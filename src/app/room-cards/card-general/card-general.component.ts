import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-general',
  imports: [CommonModule],
  templateUrl: './card-general.component.html',
  styleUrl: './card-general.component.css',
})
export class CardGeneralComponent {
  @Input() habitacion: any;

  getFormattedFecha(fecha: string): Date {
    // Replace space with 'T' to make it ISO 8601-compliant
    return new Date(fecha.replace(' ', 'T'));
  }
}
