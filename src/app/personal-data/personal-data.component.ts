import { CommonModule } from '@angular/common'; // Importa CommonModule aquí
import { Component, OnInit } from '@angular/core';
import { ActualRoomService } from '../services/actual-room/actual-room.service';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
  standalone: true, // Habilita el modo standalone
  imports: [CommonModule], // Importa CommonModule aquí para *ngIf, etc.
})
export class PersonalDataComponent implements OnInit {
  personalData: any = {};
  habitacionId!: string;
  isLoading = true;

  constructor(
    private patientService: PatientService,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    console.log('PersonalDataComponent initialized');
    //const storedData = localStorage.getItem('patientData');
    const storedData = this.actualRoomService.getCurrentRoomAndPatient();

    if (storedData.roomNumber) {
      const habitacionCodigo = storedData.roomNumber;
      this.habitacionId = habitacionCodigo;

      this.isLoading = true;

      this.patientService.getPatientPersonalData(habitacionCodigo).subscribe(
        (patient) => {
          this.personalData = patient || {};
          this.isLoading = false;
          console.log('Personal Data:', this.personalData);
        },
        (error) => {
          console.error('Error fetching patient data:', error);
          this.personalData = {};
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }
}
