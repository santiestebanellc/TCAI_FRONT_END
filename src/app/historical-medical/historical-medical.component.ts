import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-historical-medical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-medical.component.html',
  styleUrls: ['./historical-medical.component.css'],
})
export class HistoricalMedicalComponent implements OnInit {
  @Input() pacienteId!: number;
  @Output() diagnosticoSelected = new EventEmitter<number>();
  diagnosticos: any[] = [];
  selectedDiagnosticoId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedData = localStorage.getItem('patientData');
    console.log('Stored data:', storedData);
    if (storedData) {
      const { pacienteId } = JSON.parse(storedData);
      this.pacienteId = pacienteId;
      this.loadPacienteDiagnosticos();
    } else {
      console.error('No patient data found in local storage.');
    }
  }

  // Cargar registros médicos del paciente
  loadPacienteDiagnosticos() {
    if (!this.pacienteId) {
      console.error('Paciente ID is not defined.');
      return;
    }

    this.http
      .get<any>('http://localhost:8000/diagnostico/paciente/1')
      .subscribe({
        next: (response) => {
          if (response.success && response.content) {
            this.diagnosticos = response.content.map((item: any) => {
              const fecha = new Date(item.diagnostico.fecha);
              const date = fecha.toLocaleDateString('es-ES');
              const time = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return {
                id: item.diagnostico_id,
                time,
                date,
                name: `${item.diagnostico.nombre_auxiliar} (${item.diagnostico.numero_auxiliar})`,
                shift: item.diagnostico.toma,
                diagnosis: {
                  avd: item.diagnostico.avd, // Asegúrate de tener estos valores
                  o2: item.diagnostico.o2,
                  panales: item.diagnostico.panales,
                },
                priority: (item.diagnostico.o2 || '')
                  .toString()
                  .includes('90'), // Prioridad si el O2 contiene 90
              };
            });

            console.log('Diagnósticos adaptados:', this.diagnosticos);
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
  selectDiagnostico(id: number) {
    this.selectedDiagnosticoId = id;
  }

  isSelected(id: number): boolean {
    return this.selectedDiagnosticoId === id;
  }

  onCardClick(diagnosticoId: number): void {
    this.diagnosticoSelected.emit(diagnosticoId);
  }
}
