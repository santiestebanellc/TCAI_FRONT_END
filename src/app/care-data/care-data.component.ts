import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { CareDataSummaryComponent } from '../care-data-summary/care-data-summary.component';
import { HistoricalComponent } from '../historical/historical.component';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-care-data',
  imports: [
    CommonModule,
    CareDataSummaryComponent,
    HistoricalComponent,
    ButtonComponent,
    RouterOutlet,
  ],
  templateUrl: './care-data.component.html',
  styleUrl: './care-data.component.css',
})
export class CareDataComponent implements OnInit {
  pacienteId!: number;
  registroId!: number;
  selectedFilter: string | null = null;

  isAddCareDataRouteActive = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('CareDataComponent initialized');
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      const { pacienteId } = JSON.parse(storedData);
      this.pacienteId = pacienteId;
      this.patientService.getCareDataByPaciente(pacienteId);
    }

    this.isAddCareDataRouteActive = this.router.url.includes('add-care-data');
    this.router.events.subscribe(() => {
      this.isAddCareDataRouteActive = this.router.url.includes('add-care-data');
    });
  }

  showAddCareData() {
    this.router.navigate(['/care-data/add-care-data']);
  }

  onRegistroSelected(registroId: number): void {
    this.registroId = registroId;
  }

  onButtonClick(filter: string): void {
    this.selectedFilter = this.selectedFilter === filter ? null : filter; // Toggle: activa/desactiva el filtro
    console.log('Filtro seleccionado:', this.selectedFilter); // Para depuración
  }
}
