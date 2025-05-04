import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardDietsComponent } from '../../room-cards/card-diets/card-diets.component';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';

@Component({
  selector: 'app-diets',
  imports: [CardDietsComponent, CardEmptyComponent, CommonModule],
  templateUrl: './diets.component.html',
  styleUrl: './diets.component.css',
})
export class DietsComponent implements OnInit {
  habitaciones: any[] = [];
  actualRoom: string | undefined = undefined;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

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
    this.actualRoomService.resetActualRoom();
  }

  onCardClick(pacienteId: number, habitacionCodigo: string): void {
    if (pacienteId && habitacionCodigo) {
      console.log('Storing patient data:', { pacienteId, habitacionCodigo });
      localStorage.setItem(
        'patientData',
        JSON.stringify({ pacienteId, habitacionCodigo })
      );

      this.actualRoomService.setActualRoom(habitacionCodigo);

      this.router.navigate(['/care-data']);
    }
  }
}
