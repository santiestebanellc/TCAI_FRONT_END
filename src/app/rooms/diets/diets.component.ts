import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardDietsComponent } from '../../room-cards/card-diets/card-diets.component';
import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-diets',
  standalone: true,
  imports: [
    CommonModule,
    CardDietsComponent,
    CardEmptyComponent,
    SearchBarComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './diets.component.html',
  styleUrls: ['./diets.component.css'],
})
export class DietsComponent implements OnInit {
  habitaciones: any[] = [];
  filteredHabitaciones: any[] = [];
  isLoading = true;
  showLoader = true;

  // Paginación
  currentPage = 1;
  itemsPerPage = 16;

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

          console.log('Habitaciones cargadas:', this.filteredHabitaciones.length);
          console.log('Total páginas tras carga:', this.totalPages);
        }
        this.isLoading = false;
        setTimeout(() => this.showLoader = false, 500);
      },
      error: (error: any) => {
        console.error('Error al cargar habitaciones', error);
        this.isLoading = false;
        setTimeout(() => this.showLoader = false, 500);
      },
    });
  }

  get paginatedHabitaciones(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const paginated = this.filteredHabitaciones.slice(start, start + this.itemsPerPage);

    // Log para depurar paginación
    console.log(`Página actual: ${this.currentPage}`);
    console.log('Habitaciones en página:', paginated.length);

    return paginated;
  }

  get totalPages(): number {
    const pages = Math.ceil(this.filteredHabitaciones.length / this.itemsPerPage);
    return pages > 0 ? pages : 1;  // mínimo 1 página para evitar problemas
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
    this.currentPage = 1;

    console.log('Resultado búsqueda:', this.filteredHabitaciones.length);
    console.log('Total páginas tras búsqueda:', this.totalPages);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log('Navegando a página:', page);
    }
  }

  onCardClick(pacienteId: number, habitacionCodigo: string): void {
    if (pacienteId && habitacionCodigo) {
      localStorage.setItem('patientData', JSON.stringify({ pacienteId, habitacionCodigo }));
      this.actualRoomService.setRoomAndPatient(habitacionCodigo, pacienteId.toString());
      this.router.navigate(['/care-data']);
    }
  }
}
