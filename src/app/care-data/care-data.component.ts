import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CareDataSummaryComponent } from '../care-data-summary/care-data-summary.component';
import { HistoricalComponent } from '../historical/historical.component';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-care-data',
  imports: [
    CommonModule,
    CareDataSummaryComponent,
    HistoricalComponent,
    ButtonComponent,
  ],
  templateUrl: './care-data.component.html',
  styleUrl: './care-data.component.css',
})
export class CareDataComponent implements OnInit {
  pacienteId!: number;
  registroId!: number;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    console.log('CareDataComponent initialized');
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      const { pacienteId } = JSON.parse(storedData);
      this.pacienteId = pacienteId;
      this.patientService.getCareDataByPaciente(pacienteId);
    }
  }

  onRegistroSelected(registroId: number): void {
    this.registroId = registroId;
  }
}
