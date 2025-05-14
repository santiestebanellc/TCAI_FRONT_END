import { Component, OnInit } from '@angular/core';
import { HistoricalMedicalComponent } from '../historical-medical/historical-medical.component';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient-service/patient.service';
import { CommonModule } from '@angular/common';
import { MedicalDataDisplayComponent } from '../medical-data-display/medical-data-display.component';

interface MedicalData {
  mobilitat: string;
  portadorO2: string;
  portadorO2Details?: string;
  bolquers: string;
  numCanvis: string;
  estatPell: string;
  sv: string;
  sr: string;
  sng: string;
}

@Component({
  selector: 'app-medical-data',
  imports: [
    CommonModule,
    HistoricalMedicalComponent,
    MedicalDataDisplayComponent,
    ButtonComponent,
  ],
  templateUrl: './medical-data.component.html',
  styleUrl: './medical-data.component.css',
})
export class MedicalDataComponent implements OnInit {
  pacienteId!: number; // El ID del paciente
  diagnosticoId!: number; // El ID del diagnóstico

  constructor(private router: Router, private patientService: PatientService) {}

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

  goToAddMedicalData() {
    this.router.navigate(['/add-medical-data']);
  }
}
