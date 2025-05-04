import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.css',
})
export class PersonalDataComponent implements OnInit {
  personalData: any = {};

  pacienteId!: number;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.patientData$.subscribe((data) => {
      if (data) {
        this.pacienteId = data.pacienteId;
        
        
        this.personalData = {
          nom: 'Joan',
          cognoms: 'Martínez Pérez',
          dataNaixement: '1990-05-15',
          adreca: 'Carrer Major, 123, Barcelona',
          alergies: 'Alergia a los frutos secos y al polen',
          antecedentsMedics:
            'Hipertensión diagnosticada en 2018, asma leve, cirugía de apendicitis en 2010',
          cuidador: 'Maria Gómez',
          telefon: '612 345 678',
        };
      }
    });
  }
}
