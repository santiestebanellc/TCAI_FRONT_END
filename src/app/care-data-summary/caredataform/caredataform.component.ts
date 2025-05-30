import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil, timeout } from 'rxjs';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { LoginService } from '../../services/login-service/login.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { TypeLoader } from '../../types/TypeLoader';
import { ButtonComponent } from '../../button/button.component';

interface ValidationResult {
  isValid: boolean;
  type: 'negative' | 'outOfRange' | 'empty';
  message: string;
  value?: number;
  range?: { min: number; max: number; unit: string };
}

interface VitalSignRange {
  min: number;
  max: number;
  unit: string;
}

interface ValidationWarning {
  field: string;
  fieldLabel: string;
  validation: ValidationResult;
}

@Component({
  selector: 'app-caredataform',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ButtonComponent],
  templateUrl: './caredataform.component.html',
  styleUrls: ['./caredataform.component.css'],
})
export class CaredataformComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private loginService: LoginService,
    private router: Router,
    private actualRoomService: ActualRoomService,
    private route: ActivatedRoute
  ) {}

  // Rangos normales para constantes vitales según especificaciones
  private readonly NORMAL_RANGES: Record<string, VitalSignRange> = {
    taSistolica: { min: 90, max: 140, unit: 'mmHg' },
    taDiastolica: { min: 50, max: 90, unit: 'mmHg' },
    pulso: { min: 50, max: 100, unit: 'bpm' },
    frecuenciaRespiratoria: { min: 12, max: 20, unit: 'resp/min' },
    temperatura: { min: 34.9, max: 38.5, unit: '°C' },
    saturacionOxigeno: { min: 94, max: 100, unit: '%' },
  };

  // Labels en catalán para los campos
  private readonly FIELD_LABELS: Record<string, string> = {
    taSistolica: 'Tensió sistòlica',
    taDiastolica: 'Tensió diastòlica',
    pulso: 'Pols',
    frecuenciaRespiratoria: 'Freqüència respiratòria',
    temperatura: 'Temperatura',
    saturacionOxigeno: "Saturació d'oxigen",
  };

  // Form fields
  constantesVitales = {
    taSistolica: null as number | null,
    taDiastolica: null as number | null,
    frecuenciaRespiratoria: null as number | null,
    pulso: null as number | null,
    temperatura: null as number | null,
    saturacionOxigeno: null as number | null,
  };

  sueroterapia = {
    dosis: null as number | null,
  };

  balanceHidrico = {
    diuresis: null as number | null,
    deposicion: '',
  };

  drenatges = {
    descripcion: '',
    debito: null as number | null,
  };

  dieta = {
    autonomo: null as number | null,
    protesis: null as number | null,
    tipoTexturaId: null as number | null,
    tipoDietaId: [] as number[],
  };

  movilizacion = {
    sedestacion: '',
    ayudaDeambulacion: null as number | null,
    ayudaDescripcion: '',
    cambiosPosturales: '',
  };

  higiene = {
    tipoId: null as number | null,
  };

  observaciones: string = '';
  pacienteId: number = 0;
  auxiliarId: number = 0;

  tiposHigiene: TypeLoader[] = [];
  tiposTextura: TypeLoader[] = [];
  tiposDieta: TypeLoader[] = [];

  // Validation state
  validationWarnings: Record<string, ValidationResult> = {};
  showConfirmationPopup = false;
  showSuccessPopup = false;
  showErrorPopup = false;
  errorMessage: string = '';
  pendingSubmit = false;
  isFormEmptyError = false;

  ngOnInit(): void {
    // Check route parameter for patientId
    const patientIdFromRoute = this.route.snapshot.paramMap.get('patientId');
    if (patientIdFromRoute) {
      this.pacienteId = parseInt(patientIdFromRoute, 10);
    }

    // Subscribe to roomPatient$
    this.actualRoomService.roomPatient$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && data.patientId) {
          this.pacienteId = parseInt(data.patientId, 10);
        }
        if (this.pacienteId <= 0) {
          console.warn('No valid patientId received');
          this.errorMessage = 'No s’ha seleccionat cap pacient.';
          this.showErrorPopup = true;
        }
      });

    // Set auxiliarId
    const userId = this.loginService.getUserId();
    this.auxiliarId = userId !== null && userId > 0 ? userId : 0;
    if (this.auxiliarId <= 0) {
      console.warn('Invalid auxiliarId');
      this.errorMessage = 'No s’ha pogut identificar l’auxiliar.';
      this.showErrorPopup = true;
      this.router.navigate(['/login']);
    }

    // Load types
    this.patientService
      .getTipoHigiene()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.tiposHigiene = data),
        error: (error) => {
          console.error('Error loading tiposHigiene:', error);
          this.errorMessage = 'Error al carregar els tipus d’higiene.';
          this.showErrorPopup = true;
        },
      });

    this.patientService
      .getTipoTextura()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.tiposTextura = data),
        error: (error) => {
          console.error('Error loading tiposTextura:', error);
          this.errorMessage = 'Error al carregar els tipus de textura.';
          this.showErrorPopup = true;
        },
      });

    this.patientService
      .getTipoDieta()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.tiposDieta = data),
        error: (error) => {
          console.error('Error loading tiposDieta:', error);
          this.errorMessage = 'Error al carregar los tipus de dieta.';
          this.showErrorPopup = true;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateField(
    fieldName: string,
    value: number | null | undefined
  ): ValidationResult {
    if (value === null || value === undefined) {
      return { isValid: true, type: 'empty', message: '' };
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return { isValid: true, type: 'empty', message: '' };
    }

    if (numValue < 0) {
      return {
        isValid: false,
        type: 'negative',
        message: 'El valor no pot ser negatiu',
      };
    }

    const range = this.NORMAL_RANGES[fieldName];
    if (range && (numValue < range.min || numValue > range.max)) {
      return {
        isValid: false,
        type: 'outOfRange',
        message: `Valor fora del rang normal (${range.min}-${range.max} ${range.unit})`,
        value: numValue,
        range,
      };
    }

    return { isValid: true, type: 'empty', message: '' };
  }

  onVitalSignChange(fieldName: string, value: any): void {
    const validation = this.validateField(fieldName, value);
    if (!validation.isValid) {
      this.validationWarnings[fieldName] = validation;
    } else {
      delete this.validationWarnings[fieldName];
    }
  }

  getFieldWarning(fieldName: string): ValidationResult | null {
    return this.validationWarnings[fieldName] || null;
  }

  hasWarning(fieldName: string): boolean {
    return !!this.validationWarnings[fieldName];
  }

  getInputClasses(fieldName: string): string {
    const baseClasses =
      'w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200';
    const warning = this.validationWarnings[fieldName];
    if (warning) {
      if (warning.type === 'negative') {
        return `${baseClasses} border-red-500 ring-2 ring-red-100`;
      } else if (warning.type === 'outOfRange') {
        return `${baseClasses} border-yellow-500 ring-2 ring-yellow-100`;
      }
    }
    return baseClasses;
  }

  private validateAllVitalSigns(): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];
    Object.keys(this.constantesVitales).forEach((field) => {
      const value =
        this.constantesVitales[field as keyof typeof this.constantesVitales];
      const validation = this.validateField(field, value);
      if (!validation.isValid) {
        warnings.push({
          field,
          fieldLabel: this.FIELD_LABELS[field] || field,
          validation,
        });
      }
    });
    return warnings;
  }

  private isFormEmpty(): boolean {
    const vitalSignsEmpty = Object.values(this.constantesVitales).every(
      (value) => value === null || value === undefined
    );
    const sueroterapiaEmpty =
      this.sueroterapia.dosis === null || this.sueroterapia.dosis === undefined;
    const balanceHidricoEmpty =
      (this.balanceHidrico.diuresis === null ||
        this.balanceHidrico.diuresis === undefined) &&
      (!this.balanceHidrico.deposicion ||
        this.balanceHidrico.deposicion.trim() === '');
    const drenatgesEmpty =
      (!this.drenatges.descripcion ||
        this.drenatges.descripcion.trim() === '') &&
      (this.drenatges.debito === null || this.drenatges.debito === undefined);
    const dietaEmpty =
      (this.dieta.autonomo === null || this.dieta.autonomo === undefined) &&
      (this.dieta.protesis === null || this.dieta.protesis === undefined) &&
      (this.dieta.tipoTexturaId === null ||
        this.dieta.tipoTexturaId === undefined) &&
      (!this.dieta.tipoDietaId || this.dieta.tipoDietaId.length === 0);
    const movilizacionEmpty =
      (!this.movilizacion.sedestacion ||
        this.movilizacion.sedestacion.trim() === '') &&
      (this.movilizacion.ayudaDeambulacion === null ||
        this.movilizacion.ayudaDeambulacion === undefined) &&
      (!this.movilizacion.ayudaDescripcion ||
        this.movilizacion.ayudaDescripcion.trim() === '') &&
      (!this.movilizacion.cambiosPosturales ||
        this.movilizacion.cambiosPosturales.trim() === '');
    const higieneEmpty =
      this.higiene.tipoId === null || this.higiene.tipoId === undefined;
    const observacionesEmpty =
      !this.observaciones || this.observaciones.trim() === '';

    return (
      vitalSignsEmpty &&
      sueroterapiaEmpty &&
      balanceHidricoEmpty &&
      drenatgesEmpty &&
      dietaEmpty &&
      movilizacionEmpty &&
      higieneEmpty &&
      observacionesEmpty
    );
  }

  getCurrentWarnings(): ValidationWarning[] {
    return Object.keys(this.validationWarnings).map((field) => ({
      field,
      fieldLabel: this.FIELD_LABELS[field] || field,
      validation: this.validationWarnings[field],
    }));
  }

  onNumericInputChange(value: any, field: string, section?: string): void {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue) && numValue < 0) {
      if (section) {
        (this as any)[section][field] = null;
      }
    } else {
      if (section) {
        (this as any)[section][field] = numValue;
      }
    }
    this.isFormEmptyError = false;
  }

  onTipoDietaChange(event: Event, optionId: number): void {
    const target = event.target as HTMLInputElement;
    if (!this.dieta.tipoDietaId) {
      this.dieta.tipoDietaId = [];
    }
    if (target.checked) {
      if (!this.dieta.tipoDietaId.includes(optionId)) {
        this.dieta.tipoDietaId.push(optionId);
      }
    } else {
      this.dieta.tipoDietaId = this.dieta.tipoDietaId.filter(
        (id) => id !== optionId
      );
    }
    this.isFormEmptyError = false;
  }

  saveCareForm(): void {
    this.pendingSubmit = false;
    this.validationWarnings = {};

    // Validate pacienteId and auxiliarId
    if (this.pacienteId <= 0 || this.auxiliarId <= 0) {
      this.errorMessage = 'Dades d’usuari o pacient invàlides.';
      this.showErrorPopup = true;
      this.isFormEmptyError = false;
      return;
    }

    if (this.isFormEmpty()) {
      this.errorMessage = 'Cal introduir almenys un valor al formulari.';
      this.showErrorPopup = true;
      this.isFormEmptyError = true;
      return;
    }

    this.isFormEmptyError = false;
    const warnings = this.validateAllVitalSigns();
    warnings.forEach((warning) => {
      this.validationWarnings[warning.field] = warning.validation;
    });

    if (warnings.length > 0) {
      this.showConfirmationPopup = true;
      this.pendingSubmit = true;
      return;
    }

    this.pendingSubmit = true;
    this.executeFormSave();
  }

  confirmSubmitWithWarnings(): void {
    this.showConfirmationPopup = false;
    this.pendingSubmit = true;
    this.executeFormSave();
  }

  cancelSubmit(): void {
    this.showConfirmationPopup = false;
    this.pendingSubmit = false;
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
    this.errorMessage = '';
    this.pendingSubmit = false;
    this.isFormEmptyError = false;
  }

  private executeFormSave(): void {
    // Convert tipoTexturaId to number or null
    const tipoTexturaId = this.dieta.tipoTexturaId !== null && this.dieta.tipoTexturaId !== undefined
      ? parseInt(this.dieta.tipoTexturaId as any, 10)
      : null;

    // Ensure tipoDietaId is an array of numbers
    const tipoDietaId = this.dieta.tipoDietaId && this.dieta.tipoDietaId.length > 0
      ? this.dieta.tipoDietaId.map(id => parseInt(id as any, 10))
      : null;

    // Ensure other numeric fields are properly typed
    const formData = {
      paciente_id: this.pacienteId,
      auxiliar_id: this.auxiliarId,
      constantesVitales: {
        taSistolica: this.constantesVitales.taSistolica !== null && this.constantesVitales.taSistolica !== undefined
          ? parseFloat(this.constantesVitales.taSistolica as any)
          : null,
        taDiastolica: this.constantesVitales.taDiastolica !== null && this.constantesVitales.taDiastolica !== undefined
          ? parseFloat(this.constantesVitales.taDiastolica as any)
          : null,
        frecuenciaRespiratoria: this.constantesVitales.frecuenciaRespiratoria !== null && this.constantesVitales.frecuenciaRespiratoria !== undefined
          ? parseFloat(this.constantesVitales.frecuenciaRespiratoria as any)
          : null,
        pulso: this.constantesVitales.pulso !== null && this.constantesVitales.pulso !== undefined
          ? parseFloat(this.constantesVitales.pulso as any)
          : null,
        temperatura: this.constantesVitales.temperatura !== null && this.constantesVitales.temperatura !== undefined
          ? parseFloat(this.constantesVitales.temperatura as any)
          : null,
        saturacionOxigeno: this.constantesVitales.saturacionOxigeno !== null && this.constantesVitales.saturacionOxigeno !== undefined
          ? parseFloat(this.constantesVitales.saturacionOxigeno as any)
          : null,
      },
      sueroterapia: {
        dosis: this.sueroterapia.dosis !== null && this.sueroterapia.dosis !== undefined
          ? parseFloat(this.sueroterapia.dosis as any)
          : null,
      },
      balanceHidrico: {
        diuresis: this.balanceHidrico.diuresis !== null && this.balanceHidrico.diuresis !== undefined
          ? parseFloat(this.balanceHidrico.diuresis as any)
          : null,
        deposicion: this.balanceHidrico.deposicion || null,
      },
      drenatges: {
        descripcion: this.drenatges.descripcion || null,
        debito: this.drenatges.debito !== null && this.drenatges.debito !== undefined
          ? parseFloat(this.drenatges.debito as any)
          : null,
      },
      higiene: {
        tipoId: this.higiene.tipoId !== null && this.higiene.tipoId !== undefined
          ? parseInt(this.higiene.tipoId as any, 10)
          : null,
      },
      dieta: {
        autonomo: this.dieta.autonomo !== null && this.dieta.autonomo !== undefined
          ? parseInt(this.dieta.autonomo as any, 10)
          : null,
        protesis: this.dieta.protesis !== null && this.dieta.protesis !== undefined
          ? parseInt(this.dieta.protesis as any, 10)
          : null,
        tipoTexturaId: tipoTexturaId,
        tipoDietaId: tipoDietaId,
      },
      movilizacion: {
        sedestacion: this.movilizacion.sedestacion || null,
        ayudaDeambulacion: this.movilizacion.ayudaDeambulacion !== null && this.movilizacion.ayudaDeambulacion !== undefined
          ? parseInt(this.movilizacion.ayudaDeambulacion as any, 10)
          : null,
        ayudaDescripcion: this.movilizacion.ayudaDescripcion || null,
        cambiosPosturales: this.movilizacion.cambiosPosturales || null,
      },
      observacion: this.observaciones || null,
    };

    this.patientService
      .createCareData(formData)
      .pipe(timeout(10000), takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.pendingSubmit = false;
          if (response.success) {
            this.showSuccessPopup = true;
            this.resetForm();
            this.validationWarnings = {};
            setTimeout(() => {
              this.router.navigate(['/care-data']);
            }, 1500);
          } else {
            this.errorMessage =
              response.message || 'Error al guardar les dades.';
            this.showErrorPopup = true;
          }
        },
        error: (error) => {
          this.pendingSubmit = false;
          console.error('Error al guardar:', error);
          this.errorMessage =
            error.error?.content?.message ||
            'Error de connexió amb el servidor. Si us plau, intenta-ho de nou.';
          this.showErrorPopup = true;
        },
      });
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }

  resetForm(): void {
    this.constantesVitales = {
      taSistolica: null,
      taDiastolica: null,
      frecuenciaRespiratoria: null,
      pulso: null,
      temperatura: null,
      saturacionOxigeno: null,
    };
    this.sueroterapia = { dosis: null };
    this.balanceHidrico = { diuresis: null, deposicion: '' };
    this.drenatges = { descripcion: '', debito: null };
    this.dieta = {
      autonomo: null,
      protesis: null,
      tipoTexturaId: null,
      tipoDietaId: [],
    };
    this.movilizacion = {
      sedestacion: '',
      ayudaDeambulacion: null,
      ayudaDescripcion: '',
      cambiosPosturales: '',
    };
    this.higiene = { tipoId: null };
    this.observaciones = '';
    this.validationWarnings = {};
    this.isFormEmptyError = false;
  }
}