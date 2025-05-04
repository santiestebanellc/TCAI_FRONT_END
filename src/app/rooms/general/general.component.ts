import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { CardGeneralComponent } from '../../room-cards/card-general/card-general.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';

@Component({
  selector: 'app-general',
  imports: [CardGeneralComponent, CardEmptyComponent, CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit {
  habitaciones: any[] = [];
  actualRoom: string | undefined = undefined;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    console.log('GeneralComponent initialized');
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
