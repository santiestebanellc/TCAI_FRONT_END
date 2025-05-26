import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { LoginService } from '../../services/login-service/login.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { TypeLoader } from '../../types/TypeLoader';

interface ValidationResult {
  isValid: boolean;
  type: 'negative' | 'outOfRange';
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
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './caredataform.component.html',
  styleUrls: ['./caredataform.component.css'],
})
export class CaredataformComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private loginService: LoginService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  // Rangos normales para constantes vitales
  private readonly NORMAL_RANGES: Record<string, VitalSignRange> = {
    taSistolica: { min: 90, max: 140, unit: 'mmHg' },
    taDiastolica: { min: 60, max: 90, unit: 'mmHg' },
    pulso: { min: 60, max: 100, unit: 'bpm' },
    frecuenciaRespiratoria: { min: 12, max: 20, unit: 'resp/min' },
    temperatura: { min: 36.1, max: 37.2, unit: '°C' },
    saturacionOxigeno: { min: 95, max: 100, unit: '%' },
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
  };

  dieta = {
    autonomo: null as number | null,
    protesis: null as number | null,
    tipoTexturaId: null as number | null,
    tipoDietaId: [] as number[],
  };

  movilizacion = {
    sedestacion: '',
    ayudaDeambulacion: false,
    ayudaDescripcion: '',
    cambiosPosturales: '',
  };

  higiene = {
    tipoId: -1,
  };

  observaciones: string = '';
  pacienteId: number = -1;
  auxiliarId: number = -1;

  tiposHigiene: TypeLoader[] = [];
  tiposTextura: TypeLoader[] = [];
  tiposDieta: TypeLoader[] = [];

  // Validation state
  validationWarnings: Record<string, ValidationResult> = {};
  showConfirmationPopup = false;
  showSuccessPopup = false;
  pendingSubmit = false;

  ngOnInit(): void {
    this.actualRoomService.roomPatient$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.pacienteId = parseInt(data.patientId ?? '0');
        }
      });

    this.auxiliarId = this.loginService.getUserId() || -1;

    // Load types
    this.patientService
      .getTipoHigiene()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.tiposHigiene = data;
      });

    this.patientService
      .getTipoTextura()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.tiposTextura = data;
      });

    this.patientService
      .getTipoDieta()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.tiposDieta = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Validates a specific field value against normal ranges
   */
  validateField(
    fieldName: string,
    value: number | null | undefined
  ): ValidationResult {
    if (value === null || value === undefined) {
      return { isValid: true, type: 'negative', message: '' };
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return { isValid: true, type: 'negative', message: '' };
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
        range: range,
      };
    }

    return { isValid: true, type: 'negative', message: '' };
  }

  /**
   * Validates a vital sign field and updates warnings
   */
  onVitalSignChange(fieldName: string, value: any): void {
    const validation = this.validateField(fieldName, value);

    if (!validation.isValid) {
      this.validationWarnings[fieldName] = validation;
    } else {
      delete this.validationWarnings[fieldName];
    }
  }

  /**
   * Gets validation warning for a specific field
   */
  getFieldWarning(fieldName: string): ValidationResult | null {
    return this.validationWarnings[fieldName] || null;
  }

  /**
   * Checks if a field has a warning
   */
  hasWarning(fieldName: string): boolean {
    return !!this.validationWarnings[fieldName];
  }

  /**
   * Gets CSS classes for input based on validation state
   */
  getInputClasses(fieldName: string): string {
    const baseClasses =
      'w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200';
    const warning = this.validationWarnings[fieldName];

    if (warning) {
      if (warning.type === 'negative') {
        return `${baseClasses} border-red-500 ring-2 ring-red-100`;
      } else {
        return `${baseClasses} border-yellow-500 ring-2 ring-yellow-100`;
      }
    }

    return baseClasses;
  }

  /**
   * Validates all vital signs and returns warnings
   */
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

  /**
   * Gets current validation warnings for popup display
   */
  getCurrentWarnings(): ValidationWarning[] {
    return Object.keys(this.validationWarnings).map((field) => ({
      field,
      fieldLabel: this.FIELD_LABELS[field] || field,
      validation: this.validationWarnings[field],
    }));
  }

  /**
   * Validates numeric inputs to prevent negative values
   */
  onNumericInputChange(value: any, field: string, section?: string): void {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (!isNaN(numValue) && numValue < 0) {
      // Reset to null if negative
      if (section) {
        (this as any)[section][field] = null;
      }
    }
  }

  onTipoDietaChange(event: Event, optionId: number): void {
    const target = event.target as HTMLInputElement;

    // Inicializar el array si no existe
    if (!this.dieta.tipoDietaId) {
      this.dieta.tipoDietaId = [];
    }

    if (target.checked) {
      // Añadir la opción si está marcada y no existe ya
      if (!this.dieta.tipoDietaId.includes(optionId)) {
        this.dieta.tipoDietaId.push(optionId);
      }
    } else {
      // Remover la opción si está desmarcada
      this.dieta.tipoDietaId = this.dieta.tipoDietaId.filter(
        (id) => id !== optionId
      );
    }

    console.log('Tipos de dieta seleccionados:', this.dieta.tipoDietaId);
  }

  /**
   * Handles form submission with validation
   */
  saveCareForm(): void {
    // Validate all fields
    const warnings = this.validateAllVitalSigns();

    // Update validation warnings
    this.validationWarnings = {};
    warnings.forEach((warning) => {
      this.validationWarnings[warning.field] = warning.validation;
    });

    // If there are warnings, show confirmation popup
    if (warnings.length > 0) {
      this.showConfirmationPopup = true;
      this.pendingSubmit = true;
      return;
    }

    // No warnings, proceed with save
    this.executeFormSave();
  }

  /**
   * Confirms form submission despite warnings
   */
  confirmSubmitWithWarnings(): void {
    this.showConfirmationPopup = false;
    this.pendingSubmit = false;
    this.executeFormSave();
  }

  /**
   * Cancels form submission
   */
  cancelSubmit(): void {
    this.showConfirmationPopup = false;
    this.pendingSubmit = false;
  }

  /**
   * Executes the actual form save
   */
  private executeFormSave(): void {
    const formData = {
      paciente_id: this.pacienteId,
      auxiliar_id: this.auxiliarId,
      constantesVitales: this.constantesVitales,
      sueroterapia: this.sueroterapia,
      balanceHidrico: this.balanceHidrico,
      drenaje: this.drenatges.descripcion,
      higiene: this.higiene,
      dieta: {
        ...this.dieta,
        tipoTexturaId: +(this.dieta.tipoTexturaId || -1),
        tipoDietaId: this.dieta.tipoDietaId || [],
      },
      movilizacion: {
        ...this.movilizacion,
        ayudaDeambulacion: +(this.movilizacion.ayudaDeambulacion || -1),
      },
      observacion: this.observaciones,
    };

    this.patientService
      .createCareData(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Registro creado con éxito:', response);
            this.showSuccessPopup = true;
            this.resetForm();
            this.validationWarnings = {};
          } else {
            console.warn('Error al guardar:', response.message);
            // Aquí podrías mostrar un popup de error
          }
        },
        error: (error) => {
          console.error('Error al guardar:', error);
          // Aquí podrías mostrar un popup de error
        },
      });
  }

  /**
   * Closes success popup and navigates
   */
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/care-data']);
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

    this.sueroterapia = {
      dosis: null,
    };

    this.balanceHidrico = {
      diuresis: null,
      deposicion: '',
    };

    this.drenatges = {
      descripcion: '',
    };

    this.dieta = {
      autonomo: null,
      protesis: null,
      tipoTexturaId: null,
      tipoDietaId: [],
    };

    this.movilizacion = {
      sedestacion: '',
      ayudaDeambulacion: false,
      ayudaDescripcion: '',
      cambiosPosturales: '',
    };

    this.higiene = {
      tipoId: -1,
    };

    this.observaciones = '';
    this.validationWarnings = {};
  }
}
