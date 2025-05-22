import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service'; // Ajusta la ruta si es necesario
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-alert-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-alert-icons.component.html',
  styleUrl: './user-alert-icons.component.css',
})
export class UserAlertIconsComponent implements OnInit, OnDestroy {
  nombre: string | null = localStorage.getItem('userNombre') + ' ' + localStorage.getItem('userApellidos');
  numTrabajador: string | null = localStorage.getItem('numTrabajador');

  alertCount: number = 0;
  alertas: any[] = [];
  showDropdown: boolean = false;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadAlerts();
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  loadAlerts(): void {
    this.patientService.getAlertasByPaciente().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
        this.alertCount = alertas.length;
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
        this.alertas = [];
        this.alertCount = 0;
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  private handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isClickInside = target.closest('.relative');
    if (!isClickInside) {
      this.showDropdown = false;
    }
  }
}
