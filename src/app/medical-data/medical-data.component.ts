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
  standalone: true,
  imports: [
    CommonModule,
    HistoricalMedicalComponent,
    MedicalDataDisplayComponent,
    ButtonComponent,
  ],
  templateUrl: './medical-data.component.html',
  styleUrls: ['./medical-data.component.css'],
})
export class MedicalDataComponent implements OnInit {
  pacienteId!: number;
  diagnosticoId!: number;
  selectedFilter: string | null = null; // Filtro activo

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

  goToAddMedicalData(): void {
    this.router.navigate(['/add-medical-data']);
  }

  onButtonClick(filter: string): void {
    this.selectedFilter = this.selectedFilter === filter ? null : filter; // Toggle: activa/desactiva el filtro
    console.log('Filtro seleccionado:', this.selectedFilter); // Para depuración
  }
}