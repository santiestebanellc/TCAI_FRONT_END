import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      const { pacienteId } = JSON.parse(storedData);
      this.pacienteId = pacienteId;
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

    this.http
      .get<any>(`http://localhost:8000/registro/paciente/${this.pacienteId}`)
      .subscribe({
        next: (response) => {
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
                diagnosis: item.registro.diagnostico || '', 
                notes: item.registro.observacion,
                priority: item.registro.observacion
                  .toLowerCase()
                  .includes('mejoría'),
              };
            });

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

  selectRegistro(id: number) {
    this.selectedRegistroId = id;
  }

  isSelected(id: number): boolean {
    return this.selectedRegistroId === id;
  }

  onCardClick(registroId: number): void {
    this.registroSelected.emit(registroId);
  }
}
