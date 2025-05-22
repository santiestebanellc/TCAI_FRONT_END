import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardDietsComponent } from '../../room-cards/card-diets/card-diets.component';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';

@Component({
  selector: 'app-diets',
  standalone: true,
  imports: [CommonModule, CardDietsComponent, CardEmptyComponent, SearchBarComponent],
  templateUrl: './diets.component.html',
  styleUrls: ['./diets.component.css'],
})
export class DietsComponent implements OnInit {
  habitaciones: any[] = [];
  filteredHabitaciones: any[] = [];
  isLoading = true;
  showLoader = true;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.actualRoomService.resetRoomAndPatient();
  }

  loadData(): void {
    this.patientService.getAllDiets().subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.habitacion)) {
          this.habitaciones = response.habitacion;
          this.filteredHabitaciones = [...this.habitaciones];
        }
        this.isLoading = false;

        setTimeout(() => {
          this.showLoader = false;
        }, 500); // Tiempo para animación fade-out
      },
      error: (error: any) => {
        console.error('Error al cargar habitaciones', error);
        this.isLoading = false;

        setTimeout(() => {
          this.showLoader = false;
        }, 500);
      },
    });
  }

  onSearch(searchTerm: string): void {
    this.filteredHabitaciones = this.habitaciones.filter((habitacion) => {
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

      this.actualRoomService.setRoomAndPatient(
        habitacionCodigo,
        pacienteId.toString()
      );

      this.router.navigate(['/care-data']);
    }
  }
}
