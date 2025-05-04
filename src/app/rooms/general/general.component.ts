import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient-service/patient.service';
import { CardGeneralComponent } from '../../room-cards/card-general/card-general.component';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  imports: [CardGeneralComponent, CardEmptyComponent, CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit {
  habitaciones: any[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getHabitaciones().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.habitacion)) {
          this.habitaciones = response.habitacion;
        }
      },
      error: (error: any) => {
        console.error('Error al cargar habitaciones', error);
      },
    });
  }
}
