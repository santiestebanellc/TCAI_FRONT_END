import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-medical-data-display',
  templateUrl: './medical-data-display.component.html',
  styleUrl: './medical-data-display.component.css',
  imports: [CommonModule],
})
export class MedicalDataDisplayComponent implements OnChanges, OnInit {
  @Input() diagnosticoId!: number;
  medicalData: any = {};

  // formData: MedicalData = {
  //   mobilitat: 'Autònom AVD',
  //   portadorO2: 'No',
  //   portadorO2Details: 'No requiere oxígeno suplementario',
  //   bolquers: 'Sí',
  //   numCanvis: '3',
  //   estatPell: 'Piel seca, sin lesiones visibles',
  //   sv: 'Sin datos relevantes',
  //   sr: 'Sin datos relevantes',
  //   sng: 'Sin datos relevantes',
  // };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    if (this.diagnosticoId) {
      console.log('DiagnosticoId:', this.diagnosticoId);
      this.fetchMedicalData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Watch for changes to diagnosticoId and fetch data when it changes
    if (changes['diagnosticoId'] && !changes['diagnosticoId'].firstChange) {
      this.fetchMedicalData();
    }
  }

  private fetchMedicalData(): void {
    if (!this.diagnosticoId) {
      console.warn('No diagnosticoId provided.');
      return;
    }

    // Call the service to fetch patient data using the diagnosticoId
    this.patientService.getMedicalPatientData(this.diagnosticoId).subscribe(
      (data) => {
        console.log('Fetched data:', data);
        if (data && data.content.diagnostico) {
          const diagnostico = data.content.diagnostico;
          this.updateMedicalData(diagnostico);
        } else {
          console.warn('No data found for the provided diagnosticoId.');
        }
      },
      (error) => {
        console.error('Error fetching medical data:', error);
      }
    );
  }

  private updateMedicalData(diagnostico: any): void {
    console.log('Diagnostico:', diagnostico);

    let diaperSkinCondition = '';
    let diaperChangeCount = '';

    console.log('Panales descripcion:', diagnostico.panales_descripcion);

    if (diagnostico?.panales_descripcion) {
      const parts = diagnostico.panales_descripcion.split('::');
      diaperSkinCondition = parts[0] || '';
      diaperChangeCount = parts[1] || '0';
      console.log('Diaper skin condition:', diaperSkinCondition);
      console.log('Diaper change count:', diaperChangeCount);
    }

    this.medicalData = {
      mobilitat: diagnostico?.avd || '-',
      portadorO2: diagnostico?.o2 || 0,
      portadorO2Details: diagnostico?.o2_descripcion || '-',
      bolquers: diagnostico?.panales || 0,
      numCanvis: diaperChangeCount,
      estatPell: diaperSkinCondition,
      sv: diagnostico?.sv || '-',
      sr: diagnostico?.sr || '-',
      sng: diagnostico?.sng || '-',
      date: diagnostico?.fecha
        ? new Date(diagnostico.fecha).toLocaleDateString('es-ES')
        : '-',
      time: diagnostico?.fecha
        ? new Date(diagnostico.fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '-',
    };
    console.log('Medical Data:', this.medicalData);
  }
}
