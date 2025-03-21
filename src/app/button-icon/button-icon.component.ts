import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.css'
})
export class ButtonIconComponent {
  @Input() text: string = 'Afegir cura';
  @Input() onClick?: () => void;
  @Input() showIcon: boolean = true;
}

