import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';

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

  constructor(private patientService: PatientService) {}

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
          this.diagnosticos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
          if (this.diagnosticos.length > 0) {
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
