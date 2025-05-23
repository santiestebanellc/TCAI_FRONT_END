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
  imports: [
    CardGeneralComponent,
    CardEmptyComponent,
    CommonModule,
    SearchBarComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  habitacion: any[] = []; // Habitaciones paginadas recibidas del backend
  actualRoom: string | undefined = undefined;

  isLoading = true;
  showLoader = true;

  // Paginación
  currentPage = 1;
  itemsPerPage = 16;
  totalPages = 0;
  totalItems = 0;

  // Búsqueda
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    console.log('GeneralComponent initialized');
    this.loadHabitaciones();
    this.actualRoomService.resetRoomAndPatient();
  }

  loadHabitaciones(): void {
    this.isLoading = true;
    this.patientService
      .getHabitaciones(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          if (response.success && Array.isArray(response.habitacion)) {
            this.habitacion = response.habitacion; // Datos paginados
            this.currentPage = response.pagination.currentPage;
            this.totalPages = response.pagination.totalPages;
            this.totalItems = response.pagination.totalItems;
            this.itemsPerPage = response.pagination.itemsPerPage;

            localStorage.setItem('habitaciones', JSON.stringify(this.habitacion));
            console.log('Habitaciones guardadas en localStorage');
          } else {
            this.habitacion = [];
            this.totalPages = 0;
            this.totalItems = 0;
          }

          this.isLoading = false;
          setTimeout(() => (this.showLoader = false), 500);
        },
        error: (error: any) => {
          console.error('Error al cargar habitaciones', error);
          this.isLoading = false;
          setTimeout(() => (this.showLoader = false), 500);
        },
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1; // Resetear a la primera página tras búsqueda
    this.loadHabitaciones();
  }

  onCardClick(pacienteId: number, habitacionCodigo: string): void {
    if (pacienteId && habitacionCodigo) {
      console.log('Storing patient data:', { pacienteId, habitacionCodigo });
      localStorage.setItem('patientData', JSON.stringify({ pacienteId, habitacionCodigo }));
      this.actualRoomService.setRoomAndPatient(habitacionCodigo, pacienteId.toString());
      this.router.navigate(['/care-data']);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHabitaciones();
    }
  }
}