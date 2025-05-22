import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  host: {
    class: 'w-auto h-auto self-start inline-block',
  },
})
export class ButtonComponent {
  @Input() text: string = 'Afegir cura';
  @Input() onClick?: () => void;
  @Input() showIcon: boolean = true;
  @Input() route?: any[];
}
