import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { ActualRoomService } from '../services/actual-room/actual-room.service';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-medical-data-form',
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './medical-data-form.component.html',
  styleUrls: ['./medical-data-form.component.css'],
})
export class MedicalDataFormComponent implements OnInit {
  // Tab control
  activeTab: string = 'registro';
  
  // Current date
  currentDate: Date = new Date();

  diagnosis = '';
  motive = '';

  mobility = '';
  oxygenTherapy = '';
  oxygenType = '';
  diaperUse = '';
  diaperChanges: number | null = null;
  diaperSkinCondition = '';
  nasogastricTubePosition = '';
  nasogastricTubeObservations = '';
  rectalTube = '';
  vesicalTube = '';

  // Logged nurse
  userNombre = localStorage.getItem('userNombre');
  userApellidos = localStorage.getItem('userApellidos');
  numTrabajador = localStorage.getItem('numTrabajador');
  userId = localStorage.getItem('userId');

  // Selected patient
  pacienteId: number | null = null;
  habitacionCodigo: string | null = null;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    this.actualRoomService.roomPatient$;
    this.actualRoomService.roomPatient$.subscribe((data) => {
      if (data) {
        this.pacienteId = parseInt(data.patientId ?? '0');
        this.habitacionCodigo = data.roomNumber;
      }
    });
  }

  sanitizeDiaperChanges(): void {
    if (this.diaperChanges === null || this.diaperChanges < 0) {
      this.diaperChanges = 0;
    }
  }

  saveForm() {
    const payload = {
      paciente_id: this.pacienteId,
      auxiliar_id: this.userId ? parseInt(this.userId, 10) : null,
      diagnostico: this.diagnosis || 'Diagnòstic no especificat',
      motivo: this.motive || 'Motiu no especificat',
      avd: this.mobility,
      o2: this.oxygenTherapy === 'yes' ? 1 : 0,
      o2_descripcion: this.oxygenType || 'No requereix oxigen',
      panales: this.diaperUse === 'yes' ? 1 : 0,
      panales_descripcion:
        this.diaperUse === 'yes'
          ? `${this.diaperSkinCondition || 'Sense informació'}::${
              this.diaperChanges ?? 0
            }`
          : 'No fa servir bolquers::0',
      sv: this.vesicalTube || 'No aplica',
      sr: this.rectalTube || 'No aplica',
      sng: this.nasogastricTubeObservations || 'No aplica',
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