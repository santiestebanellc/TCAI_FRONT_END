import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CareDataSummaryComponent } from '../care-data-summary/care-data-summary.component';
import { HistoricalComponent } from '../historical/historical.component';

@Component({
  selector: 'app-care-data',
  imports: [CommonModule, CareDataSummaryComponent, HistoricalComponent ],
  templateUrl: './care-data.component.html',
  styleUrl: './care-data.component.css',
})
export class CareDataComponent {
  constructor(private route: ActivatedRoute) {}
}
