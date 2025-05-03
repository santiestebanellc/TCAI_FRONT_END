import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicalDataFormComponent } from "../medical-data-form/medical-data-form.component";
import { CaredataformComponent } from "../caredataform/caredataform.component";

@Component({
  selector: 'app-alerts-page',
  imports: [CommonModule],
  templateUrl: './alerts-page.component.html',
  styleUrl: './alerts-page.component.css',
})
export class AlertsPageComponent {
  constructor(private route: ActivatedRoute) {}
}
