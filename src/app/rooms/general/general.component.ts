import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { CardGeneralComponent } from '../../room-cards/card-general/card-general.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';

@Component({
  selector: 'app-general',
  standalone: true, // Add this since you're using standalone components
  imports: [CardGeneralComponent, CardEmptyComponent, CommonModule, SearchBarComponent],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'], // Fix the property name from `styleUrl` to `styleUrls`
})
export class GeneralComponent implements OnInit {
  habitaciones: any[] = [];
  filteredHabitaciones: any[] = []; // Add this to hold filtered rooms
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
          this.filteredHabitaciones = [...this.habitaciones]; // Initialize with all rooms
          localStorage.setItem('habitaciones', JSON.stringify(this.habitaciones));
          console.log('Habitaciones guardadas en localStorage');
        }
      },
      error: (error: any) => {
        console.error('Error al cargar habitaciones', error);
      },
    });

    this.actualRoomService.resetActualRoom();
  }

  onSearch(searchTerm: string): void {
    this.filteredHabitaciones = this.habitaciones.filter(habitacion => {
      const paciente = habitacion.paciente || {};
      const nombre = `${paciente.nombre} ${paciente.apellido || ''}`.toLowerCase();
      return (
        nombre.includes(searchTerm.toLowerCase()) ||
        habitacion.habitacion_codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
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