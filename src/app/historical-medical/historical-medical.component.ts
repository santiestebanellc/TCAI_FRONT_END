import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-historical-medical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-medical.component.html',
  styleUrls: ['./historical-medical.component.css'],
})
export class HistoricalMedicalComponent implements OnInit {
  records: any[] = [];
  selectedRecordId: number | null = null;
  pacienteId!: number; // ID del paciente

  constructor(private http: HttpClient, private patientService: PatientService) {}

  ngOnInit(): void {
    // Recuperar el pacienteId desde el servicio
    this.patientService.patientData$.subscribe((data) => {
      if (data) {
        this.pacienteId = data.pacienteId; // Asignar el pacienteId desde el servicio
        this.loadMedicalRecords();
      } else {
        console.error('No patient data found.');
      }
    });
  }

  // Cargar registros médicos del paciente
  loadMedicalRecords() {
    if (!this.pacienteId) {
      console.error('Paciente ID no está definido.');
      return;
    }

    this.http
      .get<any>(`http://localhost:8000/diagnostico/paciente/${this.pacienteId}`)
      .subscribe({
        next: (response) => {
          if (response.success && response.content) {
            this.records = response.content.map((item: any) => {
              const fecha = new Date(item.detalle_diagnostico.fecha);
              const date = fecha.toLocaleDateString('es-ES');
              const time = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return {
                id: item.diagnostico_id,
                time,
                date,
                name: `${item.detalle_diagnostico.nombre_auxiliar} (${item.detalle_diagnostico.numero_auxiliar})`,
                shift: item.detalle_diagnostico.toma,
                diagnosis: {
                  avd: item.detalle_diagnostico.avd, // Asegúrate de tener estos valores
                  o2: item.detalle_diagnostico.o2,
                  panales: item.detalle_diagnostico.panales,
                },
                priority: (item.detalle_diagnostico.o2 || '')
                  .toString()
                  .includes('90'), // Prioridad si el O2 contiene 90
              };
            });

            console.log('Diagnósticos adaptados:', this.records);
          } else {
            console.error('Respuesta inválida:', response);
          }
        },
        error: (error) => {
          console.error('Error al obtener diagnósticos del paciente:', error);
        },
      });
  }

  // Seleccionar un registro
  selectRecord(id: number) {
    this.selectedRecordId = id;
  }

  // Verificar si el registro está seleccionado
  isSelected(id: number): boolean {
    return this.selectedRecordId === id;
  }
}
