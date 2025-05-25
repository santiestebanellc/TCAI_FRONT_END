import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { CardEmptyComponent } from '../../room-cards/card-empty/card-empty.component';
import { CardGeneralComponent } from '../../room-cards/card-general/card-general.component';
import { ActualRoomService } from '../../services/actual-room/actual-room.service';
import { PatientService } from '../../services/patient-service/patient.service';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CardGeneralComponent,
    CardEmptyComponent,
    SearchBarComponent,
    LoadingSpinnerComponent,
    CommonModule,
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit, OnDestroy {
  habitaciones: any[] = [];
  isLoading = true;

  currentPage = 1;
  itemsPerPage = 16;
  totalPages = 0;
  totalItems = 0;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    this.loadHabitaciones();
    this.actualRoomService.resetRoomAndPatient();

    this.searchSubject
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm: string) => {
        this.currentPage = 1;
        this.loadHabitaciones(this.currentPage, searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHabitaciones(page: number = 1, searchTerm: string = ''): void {
    this.isLoading = true;
    this.patientService.getHabitaciones(page, this.itemsPerPage, searchTerm).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.habitacion)) {
          this.habitaciones = response.habitacion;
          this.totalItems = response.pagination.total_items;
          this.totalPages = response.pagination.total_pages;
          this.currentPage = page;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar habitaciones', error);
        this.isLoading = false;
      },
    });
  }

onSearch(searchTerm: string): void {
  if (searchTerm.trim() === '') {
    this.currentPage = 1;
    this.loadHabitaciones();
  } else {
    this.searchSubject.next(searchTerm);
  }
}


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadHabitaciones(page);
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
