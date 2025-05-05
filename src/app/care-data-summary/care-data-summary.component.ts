import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-care-data-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './care-data-summary.component.html',
  styleUrls: ['./care-data-summary.component.css']
})
export class CareDataSummaryComponent implements OnChanges, OnInit {
  @Input() registroId!: number; // Input property for the selected registro ID
  careData: any = {}; // Object to store care data

  // Keys for vital signs to display in the UI
  vitalKeys = ['sys', 'dia', 'fr', 'fc', 'take', 'spo2'];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    // Initial fetch if registroId is already set
    if (this.registroId) {
      this.fetchCareData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Watch for changes to registroId and fetch data when it changes
    if (changes['registroId'] && !changes['registroId'].firstChange) {
      this.fetchCareData();
    }
  }

  private fetchCareData(): void {
    if (!this.registroId) {
      console.warn('No registroId provided.');
      return;
    }

    // Call the service to fetch patient data using the registroId
    this.patientService.getPatientData(this.registroId).subscribe(
      (data) => {
        if (data && data.content && data.content.registro) {
          const registro = data.content.registro;
          this.updateCareData(registro);
        } else {
          console.warn('No data found for the provided registroId.');
        }
      },
      (error) => {
        console.error('Error fetching care data:', error);
      }
    );
  }

  private updateCareData(registro: any): void {
    this.careData.vitalSigns = {
      sys: registro?.constantes_vitales?.ta_sistolica || '-',
      dia: registro?.constantes_vitales?.ta_diastolica || '-',
      fr: registro?.constantes_vitales?.frecuencia_respiratoria || '-',
      fc: registro?.constantes_vitales?.pulso || '-',
      take: registro?.constantes_vitales?.temperatura || '-',
      spo2: registro?.constantes_vitales?.saturacion_oxigeno || '-'
    };

    console.log('Vital Signs:', this.careData.vitalSigns);

    // Update diet data
    this.careData.dieta = {
      tipo_dieta: registro?.dieta?.tipo_dieta || '-',
      tipo_textura: registro?.dieta?.tipo_textura || '-',
      autonomo: registro?.dieta?.autonomo || 0,
      protesi: registro?.dieta?.protesi || 0
    };

    // Update hygiene data
    this.careData.hygiene = {
      hygieneType: registro?.higiene?.tipo_higiene || '-',
      hygieneDescription: registro?.higiene?.higiene_descripcion || '-'
    };

    // Update fluid therapy and diuresis data
    this.careData.fluidTherapy = registro?.sueroterapia || '-';
    this.careData.diuresis = registro?.balance_hidrico?.diuresis || '-';

    // Update bowel movements
    this.careData.bowelMovements = registro?.balance_hidrico?.deposicion || '-';

    // Update drainage data
    this.careData.drainage = {
      type: registro?.drenaje || '-',
      debit: registro?.debit || '-'
    };

    // Update mobility data
    this.careData.mobility = {
      sitting: registro?.movilizacion?.sedestacion || '-',
      walking: registro?.movilizacion?.ayuda_deambulacion || '-',
      desc: registro?.movilizacion?.ayuda_descripcion || '-',
      postureChanges: registro?.movilizacion?.cambios_posturales || '-'
    };

    // Update observation data
    this.careData.observation = {
      date: registro?.fecha || '-',
      authorName: registro?.auxiliar.nombre || '-',
      authorNum: registro?.auxiliar.num_trabajador || '-',
      text: registro?.observacion || '-'
    };
  }
}