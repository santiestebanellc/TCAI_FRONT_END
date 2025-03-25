import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class HeaderTitleComponent {
  @Input() title: string = 'Habitació #1234';
  @Input() subtitle?: string = 'Medical data';
  @Input() showBackButton: boolean = true;
  @Input() showForwardButton: boolean = true;
}