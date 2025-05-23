import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ActualRoomService } from '../services/actual-room/actual-room.service';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-historical-medical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-medical.component.html',
  styleUrls: ['./historical-medical.component.css'],
})
export class HistoricalMedicalComponent implements OnInit, OnChanges {
  @Input() pacienteId!: number;
  @Input() selectedDiagnosticoId: number | null = null; // Recibe el ID seleccionado del componente padre
  @Output() diagnosticoSelected = new EventEmitter<number>();
  diagnosticos: any[] = [];

  constructor(
    private patientService: PatientService,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    const storedData = this.actualRoomService.getCurrentRoomAndPatient();
    console.log('Stored data:', storedData);
    if (storedData.patientId) {
      this.pacienteId = parseInt(storedData.patientId);
      this.loadPacienteDiagnosticos();
    } else {
      console.error('No patient data found in local storage.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDiagnosticoId']) {
      console.log('Selected Diagnostico ID changed:', this.selectedDiagnosticoId);
    }
  }

  // Cargar registros médicos del paciente
  loadPacienteDiagnosticos() {
    if (!this.pacienteId) {
      console.error('Paciente ID is not defined.');
      return;
    }

    this.patientService.getDiagnosticoByPaciente(this.pacienteId).subscribe({
      next: (response: any) => {
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
              fecha, // Keep actual Date object for sorting
              time,
              date,
              name: `${item.diagnostico.nombre_auxiliar} (${item.diagnostico.numero_auxiliar})`,
              shift: item.diagnostico.toma,
              diagnosis: {
                avd: item.diagnostico.avd,
                o2: item.diagnostico.o2,
                panales: item.diagnostico.panales,
              },
              priority: (item.diagnostico.o2 || '').toString().includes('90'),
            };
          });

          // Sort and emit latest diagnostico
          this.diagnosticos.sort(
            (a, b) => b.fecha.getTime() - a.fecha.getTime()
          );
          if (this.diagnosticos.length > 0 && !this.selectedDiagnosticoId) {
            const latest = this.diagnosticos[0];
            this.selectedDiagnosticoId = latest.id;
            this.diagnosticoSelected.emit(latest.id);
          }
        } else {
          console.error('Respuesta inválida:', response);
        }
      },
      error: (err) => {
        console.error('Error fetching diagnósticos:', err);
      },
    });
  }

  isSelected(id: number): boolean {
    return this.selectedDiagnosticoId === id;
  }

  onCardClick(diagnosticoId: number): void {
    this.selectedDiagnosticoId = diagnosticoId; // Actualiza el ID seleccionado
    this.diagnosticoSelected.emit(diagnosticoId); // Emite el evento al componente padre
    console.log('Diagnostico seleccionado:', this.selectedDiagnosticoId); // Para depuración
  }
}
