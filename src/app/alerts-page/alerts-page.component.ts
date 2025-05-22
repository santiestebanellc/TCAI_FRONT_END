import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule],
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
      next: (alertas) => {
        this.alerts = alertas.map((alerta: any, index: number) => {
          const message = alerta.alertas.map((a: any) => a.mensaje).join('; ');
          const priority = alerta.alertas.some((a: any) =>
            ['ta_sistolica', 'ta_diastolica', 'saturacion_oxigeno'].includes(a.parametro)
          ) ? 'high' : 'medium';

          const timestamp = new Date(alerta.fecha);
          if (isNaN(timestamp.getTime())) {
            console.warn(`Fecha inválida para alerta ${alerta.registro_id}: ${alerta.fecha}`);
         //   timestamp = new Date();
          }

          // Generar un número de habitación como "H001", "H002", etc.
          const roomNumber = `H${String(index + 1).padStart(3, '0')}`; // H001, H002, ...

          return {
            id: `${alerta.registro_id}-${index}`,
            type: 'vital',
            priority: priority,
            status: 'pending',
            room: alerta.room || roomNumber, // Usamos el valor del backend si existe, si no, generamos uno
            floor: 'Desconocida',
            patientId: alerta.paciente_id.toString(),
            patientName: alerta.paciente_nombre || `Paciente ${alerta.paciente_id}`,
            message: message || 'Alerta de constantes vitales',
            timestamp: timestamp,
            tags: alerta.alertas.map((a: any) => a.parametro),
          } as Alert;
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
        this.isLoading = false;
        this.alerts = [];
      }
    });
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'diet': return 'fa-utensils';
      case 'medication': return 'fa-pills';
      case 'allergy': return 'fa-exclamation-circle';
      case 'vital': return 'fa-heartbeat';
      default: return 'fa-bell';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'diet': return 'Dieta';
      case 'medication': return 'Medicación';
      case 'allergy': return 'Alergia';
      case 'vital': return 'Signos vitales';
      default: return 'Alerta';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En proceso';
      case 'resolved': return 'Resuelta';
      default: return status;
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  }
}