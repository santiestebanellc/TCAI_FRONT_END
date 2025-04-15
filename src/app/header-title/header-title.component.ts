import { CommonModule } from '@angular/common';
import { Component, Input, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActualPageService } from '../services/actual-page-service/actual-page.service';

@Component({
  selector: 'app-header-title',
  standalone: true,
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class HeaderTitleComponent {
  @Input() showBackButton: boolean = true;
  @Input() showForwardButton: boolean = true;

  title: Signal<string[]>;

  constructor(private actualPageService: ActualPageService) {
    this.title = this.actualPageService.activeTitle;
  }

  get subtitle(): string {
    return this.title()[0] || '';
  }
  get mainTitle(): string {
    return this.title()[1] || '';
  }
}
