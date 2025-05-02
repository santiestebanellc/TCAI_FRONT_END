import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient-service/patient.service'; 
import { HttpClientModule } from '@angular/common/http';  

@Component({
  selector: 'app-card-empty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-empty.component.html',
  styleUrls: ['./card-empty.component.css']
})
export class CardEmptyComponent implements OnInit {
  habitaciones: any[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getHabitaciones().subscribe({
      next: (response: any) => {
        console.log(response);  
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

