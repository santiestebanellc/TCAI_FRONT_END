import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  @Input() showIcon: boolean = true;
  @Input() route?: string | any[]; // <- acepta string o array de segmentos

  constructor(private router: Router) {}

  handleClick() {
    if (this.route) {
      this.router.navigate(
        Array.isArray(this.route) ? this.route : [this.route]
      );
    }
  }
}
