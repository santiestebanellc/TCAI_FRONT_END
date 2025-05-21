import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { HistoricalMedicalComponent } from '../historical-medical/historical-medical.component';
import { MedicalDataDisplayComponent } from '../medical-data-display/medical-data-display.component';
import { ActualRoomService } from '../services/actual-room/actual-room.service';
import { PatientService } from '../services/patient-service/patient.service';

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

  constructor(
    private router: Router,
    private patientService: PatientService,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    console.log('MedicalDataComponent initialized');
    const storedData = this.actualRoomService.getCurrentRoomAndPatient();
    if (storedData.patientId) {
      this.pacienteId = parseInt(storedData.patientId);
      this.patientService.getDiagnosticoByPaciente(this.pacienteId);
    }
  }

  onDiagnosticoSelected(diagnosticoId: number): void {
    this.diagnosticoId = diagnosticoId;
  }

  goToAddMedicalData() {
    this.router.navigate(['/add-medical-data']);
  }
}
