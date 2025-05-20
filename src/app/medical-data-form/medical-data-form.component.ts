import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-medical-data-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-data-form.component.html',
  styleUrls: ['./medical-data-form.component.css'],
})
export class MedicalDataFormComponent implements OnInit {
  // Tab control
  activeTab: string = 'registro';
  
  // Current date
  currentDate: Date = new Date();

  mobility = '';
  oxygenTherapy = '';
  oxygenType = '';
  diaperUse = '';
  diaperChanges: number | null = null;
  diaperSkinCondition = '';
  perinealSkinCondition = '';
  urinaryCatheter = '';
  nasogastricTubePosition = '';
  nasogastricTubeObservations = '';
  rectalTube = '';

  // Logged nurse
  userNombre = localStorage.getItem('userNombre');
  userApellidos = localStorage.getItem('userApellidos');
  numTrabajador = localStorage.getItem('numTrabajador');
  userId = localStorage.getItem('userId');

  // Selected patient
  pacienteId: number | null = null;
  habitacionCodigo: string | null = null;

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.patientService.patientData$.subscribe((data) => {
      if (data) {
        this.pacienteId = data.pacienteId;
        this.habitacionCodigo = data.habitacionCodigo;
      }
    });
  }

  saveForm() {
    const payload = {
      paciente_id: this.pacienteId,
      auxiliar_id: this.userId ? parseInt(this.userId, 10) : null,
      diagnostico: this.perinealSkinCondition || 'Diagnóstico no especificado',
      motivo: this.urinaryCatheter || 'Motivo no especificado',
      avd: this.mobility,
      o2: this.oxygenTherapy === 'yes' ? 1 : 0,
      o2_descripcion: this.oxygenType || 'No requiere oxígeno',
      panales: this.diaperUse === 'yes' ? 1 : 0,
      panales_descripcion:
        this.diaperUse === 'yes'
          ? `${this.diaperSkinCondition || 'Sense informació'}::${
              this.diaperChanges ?? 0
            }`
          : 'No usa pañales::0',
      sv: this.urinaryCatheter || 'No aplica',
      sr: this.rectalTube || 'No aplica',
      sng:
        this.nasogastricTubePosition === 'aspiracio' ||
        this.nasogastricTubePosition === 'declivi'
          ? `Sonda nasogástrica en ${this.nasogastricTubePosition}. ${
              this.nasogastricTubeObservations || ''
            }`
          : 'No aplica',
    };

    this.patientService.createDetalleDiagnostico(payload).subscribe({
      next: (res) => {
        if (res.success) {
          console.log('Diagnóstico creado con éxito:', res);
          this.router.navigate(['/medical-data']);
        } else {
          console.warn('Error al guardar:', res.message);
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
      },
    });
  }
}