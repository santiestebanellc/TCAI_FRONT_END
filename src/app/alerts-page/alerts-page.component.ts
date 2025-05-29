import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { PatientService } from '../services/patient-service/patient.service';

interface Alert {
  id: string;
  type: 'diet' | 'medication' | 'allergy' | 'vital';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  room: string;
  floor: string;
  patientId: string;
  patientName: string;
  message: string;
  timestamp: Date;
  tags?: string[];
}

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './alerts-page.component.html',
  styleUrls: ['./alerts-page.component.css'],
})
export class AlertsPageComponent implements OnInit {
  alerts: Alert[] = [];
  isLoading = true;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.isLoading = true;

    this.patientService.getAlertasByPaciente().subscribe({
      next: (alertes) => {
        this.alerts = alertes.map((alerta: any, index: number) => {
          const missatgeCompost = alerta.alertas
            .map((a: any) => this.getParameterLabel(a.parametro) + ': ' + a.mensaje)
            .join('; ');

          const priority = alerta.alertas.some((a: any) =>
            ['ta_sistolica', 'ta_diastolica', 'saturacion_oxigeno'].includes(a.parametro)
          )
            ? 'high'
            : 'medium';

          const timestamp = new Date(alerta.fecha);
          if (isNaN(timestamp.getTime())) {
            console.warn(`Data invàlida per a l'alerta ${alerta.registro_id}: ${alerta.fecha}`);
          }

          const roomNumber = `H${String(index + 1).padStart(3, '0')}`;

          return {
            id: `${alerta.registro_id}-${index}`,
            type: 'vital',
            priority: priority,
            status: 'pending',
            room: alerta.room || roomNumber,
            floor: 'Desconegut',
            patientId: alerta.paciente_id.toString(),
            patientName: alerta.paciente_nombre || `Pacient ${alerta.paciente_id}`,
            message: missatgeCompost || 'Alerta de constants vitals',
            timestamp: timestamp,
            tags: alerta.alertas.map((a: any) => this.getParameterLabel(a.parametro)),
          } as Alert;
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en carregar alertes:', error);
        this.isLoading = false;
        this.alerts = [];
      },
    });
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'diet':
        return 'fa-utensils';
      case 'medication':
        return 'fa-pills';
      case 'allergy':
        return 'fa-exclamation-circle';
      case 'vital':
        return 'fa-heartbeat';
      default:
        return 'fa-bell';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'diet':
        return 'Dieta';
      case 'medication':
        return 'Medicament';
      case 'allergy':
        return 'Al·lèrgia';
      case 'vital':
        return 'Constants vitals';
      default:
        return 'Alerta';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendent';
      case 'in-progress':
        return 'En procés';
      case 'resolved':
        return 'Resolta';
      default:
        return status;
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Mitjana';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  }

  getParameterLabel(param: string): string {
    switch (param) {
      case 'ta_sistolica':
        return 'Tensió sistòlica';
      case 'ta_diastolica':
        return 'Tensió diastòlica';
      case 'saturacion_oxigeno':
        return 'Saturació d’oxigen';
      case 'frecuencia_cardiaca':
        return 'Freqüència cardíaca';
      case 'temperatura':
        return 'Temperatura';
      default:
        // Transforma snake_case a format llegible
        return param
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }
}
