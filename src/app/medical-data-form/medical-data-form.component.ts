import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  // Validation properties
  isSubmitting = false;
  validationErrors: { [key: string]: string } = {};

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

  // Validation methods
  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Validate mobility (required)
    if (!this.mobility || this.mobility.trim() === '') {
      this.validationErrors['mobility'] = 'La mobilitat és obligatòria';
      isValid = false;
    }

    // Validate oxygen therapy
    if (!this.oxygenTherapy) {
      this.validationErrors['oxygenTherapy'] = 'Cal especificar si és portador d\'oxigen';
      isValid = false;
    }

    // If oxygen therapy is yes, validate oxygen type
    if (this.oxygenTherapy === 'yes' && (!this.oxygenType || this.oxygenType.trim() === '')) {
      this.validationErrors['oxygenType'] = 'Cal especificar el tipus d\'oxigen';
      isValid = false;
    }

    // Validate diaper use
    if (!this.diaperUse) {
      this.validationErrors['diaperUse'] = 'Cal especificar si és portador de bolquer';
      isValid = false;
    }

    // If diaper use is yes, validate related fields
    if (this.diaperUse === 'yes') {
      if (this.diaperChanges === null || this.diaperChanges < 0) {
        this.validationErrors['diaperChanges'] = 'Cal especificar el nombre de canvis (mínim 1)';
        isValid = false;
      }

      if (!this.diaperSkinCondition || this.diaperSkinCondition.trim() === '') {
        this.validationErrors['diaperSkinCondition'] = 'Cal descriure l\'estat de la pell perineal';
        isValid = false;
      }
    }

    // Validate patient and user data
    if (!this.pacienteId) {
      this.validationErrors['patient'] = 'No s\'ha seleccionat cap pacient';
      isValid = false;
    }

    if (!this.userId) {
      this.validationErrors['user'] = 'No s\'ha identificat l\'usuari';
      isValid = false;
    }

    // Validate text areas (minimum length for meaningful content)
    if (this.vesicalTube && this.vesicalTube.trim().length > 0 && this.vesicalTube.trim().length < 3) {
      this.validationErrors['vesicalTube'] = 'La descripció de la sonda vesical ha de tenir almenys 3 caràcters';
      isValid = false;
    }

    if (this.nasogastricTubeObservations && this.nasogastricTubeObservations.trim().length > 0 && this.nasogastricTubeObservations.trim().length < 3) {
      this.validationErrors['nasogastricTubeObservations'] = 'Les observacions de la SNG han de tenir almenys 3 caràcters';
      isValid = false;
    }

    if (this.rectalTube && this.rectalTube.trim().length > 0 && this.rectalTube.trim().length < 3) {
      this.validationErrors['rectalTube'] = 'La descripció de la sonda rectal ha de tenir almenys 3 caràcters';
      isValid = false;
    }

    return isValid;
  }

  hasError(field: string): boolean {
    return !!this.validationErrors[field];
  }

  getError(field: string): string {
    return this.validationErrors[field] || '';
  }

  clearValidationErrors(): void {
    this.validationErrors = {};
  }

  saveForm() {
    // Clear previous validation errors
    this.clearValidationErrors();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Set submitting state
    this.isSubmitting = true;

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
        this.isSubmitting = false;
        if (res.success) {
          console.log('Diagnóstico creado con éxito:', res);
          this.router.navigate(['/medical-data']);
        } else {
          console.warn('Error al guardar:', res.message);
          // Show server error inline
          this.validationErrors['server'] = res.message || 'Error al guardar les dades';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error en la petición:', err);
        // Show network/server error inline
        this.validationErrors['server'] = 'Error de connexió. Torna-ho a intentar.';
      },
    });
  }
}