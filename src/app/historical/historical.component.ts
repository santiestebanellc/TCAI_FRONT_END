import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';
import { ActualRoomService } from '../services/actual-room/actual-room.service';

@Component({
  selector: 'app-historical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css'],
})
export class HistoricalComponent implements OnInit {
  @Input() pacienteId!: number;
  @Output() registroSelected = new EventEmitter<number>();
  registros: any[] = [];
  selectedRegistroId: number | null = null;

  constructor(
    private patientService: PatientService,
    private actualRoomService: ActualRoomService
  ) {}

  ngOnInit(): void {
    const storedData = this.actualRoomService.getCurrentRoomAndPatient();
    if (storedData.patientId) {
      this.pacienteId = parseInt(storedData.patientId);
      this.loadPacienteRegistros();
    } else {
      console.error('No patient data found in local storage.');
    }
  }

  // TO CHANGE ALERT
  loadPacienteRegistros(): void {
    if (!this.pacienteId) {
      console.error('Paciente ID is not defined.');
      return;
    }

    this.patientService.getCareDataByPaciente(this.pacienteId).subscribe({
        next: (response: any) => {
          if (response.success && response.content) {
            this.registros = response.content.map((item: any) => {
              const fecha = new Date(item.registro.fecha);
              const date = fecha.toLocaleDateString('es-ES');
              const time = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return {
                id: item.registro_id,
                time,
                date,
                name: `${item.registro.nombre_auxiliar} (${item.registro.numero_auxiliar})`,
                shift: item.registro.toma,
                sys: item.registro.constantes_vitales.ta_sistolica,
                dia: item.registro.constantes_vitales.ta_diastolica,
                temp: item.registro.constantes_vitales.temperatura,
                fr: item.registro.constantes_vitales.frecuencia_respiratoria,
                fc: item.registro.constantes_vitales.pulso,
                spo2: item.registro.constantes_vitales.saturacion_oxigeno,
                notes: item.registro.observacion
              };
            });

          // Sort and emit latest diagnostico
          this.registros.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );

          if (this.registros.length > 0 && !this.selectedRegistroId) {
            const latest = this.registros[0];
            this.selectedRegistroId = latest.id;
            this.registroSelected.emit(latest.id);
            console.log('Último registro seleccionado:', latest.id);
          }
            console.log('Registros adaptados:', this.registros);
          } else {
            console.error('Respuesta inválida:', response);
          }
        },
        error: (error) => {
          console.error('Error al obtener registros del paciente:', error);
        },
      });
  }

  isSelected(id: number): boolean {
    return this.selectedRegistroId === id;
  }

  onCardClick(registroId: number): void {
    this.selectedRegistroId = registroId;
    this.registroSelected.emit(registroId);
    console.log('Registro seleccionado:', this.selectedRegistroId);
  }
}
