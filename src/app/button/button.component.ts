import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; // 👈 Agregué Input
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ButtonComponent {
  @Input() label: string = 'Filtre'; 
  @Input() bgColor: string = 'bg-black'; 
  @Input() textColor: string = 'text-white';
  @Input() size: string = 'text-lg'; 
}
