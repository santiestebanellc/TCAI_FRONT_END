import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';
import { CommonModule } from '@angular/common';
import { HistoricalMedicalComponent } from '../historical-medical/historical-medical.component';

@Component({
  selector: 'app-medical-data',
  imports: [CommonModule, HistoricalMedicalComponent],
  templateUrl: './medical-data.component.html',
  styleUrls: ['./medical-data.component.css'],
})
export class MedicalDataComponent implements OnInit {
  medicalData: any = {}; // Datos médicos del paciente
  pacienteId!: number; // El ID del paciente

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    // Intentamos cargar los datos desde localStorage si están disponibles
    const storedMedicalData = localStorage.getItem('medicalData');
    if (storedMedicalData) {
      this.medicalData = JSON.parse(storedMedicalData);
      console.log('Datos médicos cargados desde localStorage:', this.medicalData);
    }

    // Nos suscribimos al observable del servicio para obtener el pacienteId
    this.patientService.patientData$.subscribe((data) => {
      if (data) {
        this.pacienteId = data.pacienteId; // Obtener el pacienteId desde el servicio
        this.getPatientMedicalData(); // Cargar los datos del paciente
      } else {
        console.error('No patient data found in the service.');
      }
    });
  }

  // Método para obtener los datos del paciente desde el backend
  getPatientMedicalData(): void {
    if (!this.pacienteId) {
      console.error('Paciente ID no está definido.');
      return;
    }

    // Si el pacienteId está disponible, realiza la llamada al servicio para obtener los datos
    this.patientService.getPatientData(this.pacienteId).subscribe(
      (data) => {
        this.medicalData = data; // Asignamos los datos al objeto medicalData
        console.log('Datos médicos del paciente:', this.medicalData);

        // Guardamos los datos médicos en localStorage
        localStorage.setItem('medicalData', JSON.stringify(this.medicalData));
      },
      (error) => {
        console.error('Error al obtener los datos del paciente:', error);
      }
    );
  }
}
