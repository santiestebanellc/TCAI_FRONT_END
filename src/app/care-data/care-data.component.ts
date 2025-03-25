import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-care-data',
  imports: [CommonModule],
  templateUrl: './care-data.component.html',
  styleUrl: './care-data.component.css',
})
export class CareDataComponent {
  constructor(private route: ActivatedRoute) {}
}
