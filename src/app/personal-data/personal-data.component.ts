import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.css',
})
export class PersonalDataComponent implements OnInit {
  personalData: any = {};

  habitacionId!: string;

  constructor(private patientService: PatientService) {}

  // ngOnInit(): void {
  //   console.log('PersonalDataComponent initialized');
  //   const storedData = localStorage.getItem('patientData');

  //   if (storedData) {
  //     const { habitacionId } = JSON.parse(storedData);
  //     this.habitacionId = habitacionId;

  //     this.personalData =
  //       this.patientService.getPatientPersonalData(habitacionId);
  //     console.log(this.personalData);
  //   }

  //   // this.personalData = {
  //   //   nom: 'Joan',
  //   //   cognoms: 'Martínez Pérez',
  //   //   dataNaixement: '1990-05-15',
  //   //   adreca: 'Carrer Major, 123, Barcelona',
  //   //   alergies: 'Alergia a los frutos secos y al polen',
  //   //   antecedentsMedics:
  //   //     'Hipertensión diagnosticada en 2018, asma leve, cirugía de apendicitis en 2010',
  //   //   cuidador: 'Maria Gómez',
  //   //   telefon: '612 345 678',
  //   // };
  // }
  ngOnInit(): void {
    console.log('PersonalDataComponent initialized');
    const storedData = localStorage.getItem('patientData');
  
    if (storedData) {
      const { habitacionCodigo } = JSON.parse(storedData); 
      this.habitacionId = habitacionCodigo;
  
      this.patientService.getPatientPersonalData(habitacionCodigo).subscribe(
        (patient) => {
          this.personalData = patient || {};
          console.log('Personal Data:', this.personalData);
        },
        (error) => {
          console.error('Error fetching patient data:', error);
          this.personalData = {};
        }
      );
    }
  }
  
}
