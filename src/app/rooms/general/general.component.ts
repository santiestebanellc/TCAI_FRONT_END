import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { CardGeneralComponent } from '../../room-cards/card-general/card-general.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CardGeneralComponent, CardEmptyComponent, CommonModule, SearchBarComponent, LoadingSpinnerComponent],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  habitaciones: any[] = [];
  habitacionesOriginales: any[] = []; // Lista original sin filtrar
  isLoading = true;

  // Paginación
  currentPage = 1;
  itemsPerPage = 16;
  totalPages = 0;
  totalItems = 0;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    this.loadHabitaciones();
    this.actualRoomService.resetRoomAndPatient();
  }

  loadHabitaciones(): void {
    this.isLoading = true;
    this.patientService.getHabitaciones(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.habitacion)) {
          this.habitaciones = response.habitacion;
          this.habitacionesOriginales = response.habitacion; // Guardamos copia original
          this.totalItems = response.pagination.total_items;
          this.totalPages = response.pagination.total_pages;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar habitaciones', error);
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHabitaciones();
    }
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm) {
      // Si no hay término, mostramos la lista original sin filtrar
      this.habitaciones = this.habitacionesOriginales;
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();

    this.habitaciones = this.habitacionesOriginales.filter(habitacion => {
      const codigo = habitacion.habitacion_codigo?.toLowerCase() || '';
      const pacienteNombre = habitacion.paciente?.nombre?.toLowerCase() || '';
      return codigo.includes(lowerTerm) || pacienteNombre.includes(lowerTerm);
    });
  }

  onCardClick(pacienteId: number, habitacionCodigo: string): void {
    if (pacienteId && habitacionCodigo) {
      localStorage.setItem('patientData', JSON.stringify({ pacienteId, habitacionCodigo }));
      this.actualRoomService.setRoomAndPatient(habitacionCodigo, pacienteId.toString());
      this.router.navigate(['/care-data']);
    }
  }
}
