import { Component, OnInit } from '@angular/core';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { CardDietsComponent } from '../../room-cards/card-diets/card-diets.component';
import { PatientService } from '../../services/patient-service/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diets',
  imports: [CardDietsComponent, CardEmptyComponent, CommonModule],
  templateUrl: './diets.component.html',
  styleUrl: './diets.component.css',
})
export class DietsComponent implements OnInit {
  habitaciones: any[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getAllDiets().subscribe({
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
