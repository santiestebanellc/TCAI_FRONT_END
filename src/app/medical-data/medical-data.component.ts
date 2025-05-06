import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';
import { CommonModule } from '@angular/common';
import { HistoricalMedicalComponent } from '../historical-medical/historical-medical.component';
import { MedicalDataDisplayComponent } from '../medical-data-display/medical-data-display.component';

@Component({
  selector: 'app-medical-data',
  imports: [CommonModule, HistoricalMedicalComponent, MedicalDataDisplayComponent],
  templateUrl: './medical-data.component.html',
  styleUrl: './medical-data.component.css',
})
export class MedicalDataComponent implements OnInit {
  pacienteId!: number; // El ID del paciente
  diagnosticoId!: number; // El ID del diagnóstico

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    console.log('MedicalDataComponent initialized');
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      const { pacienteId } = JSON.parse(storedData);
      this.pacienteId = pacienteId;
      this.patientService.getDiagnosticoByPaciente(pacienteId);
    }
  }

  onDiagnosticoSelected(diagnosticoId: number): void {
    this.diagnosticoId = diagnosticoId;
  }
}
