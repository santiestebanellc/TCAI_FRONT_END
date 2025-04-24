import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-historical',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css']
})

export class HistoricalComponent implements OnInit {
  records: any[] = [];
  selectedRecordId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPatientRecords();
  }

  loadPatientRecords() {
    this.http.get<any>('http://localhost:8000/registro/paciente/1').subscribe({
      next: (response) => {
        if (response.success && response.content) {
          this.records = response.content.map((item: any) => {
            const fecha = new Date(item.registro.fecha);
            const date = fecha.toLocaleDateString('es-ES');
            const time = fecha.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return {
              id: item.registro_id,
              time,
              date,
              name: `${item.registro.nombre_auxiliar} (${item.registro.numero_auxiliar})`,
              shift: item.registro.toma,
              diagnosis: '', 
              notes: item.registro.observacion,
              priority: item.registro.observacion.toLowerCase().includes('mejoría')
            };
          });

          console.log('Registros adaptados:', this.records);
        } else {
          console.error('Respuesta inválida:', response);
        }
      },
      error: (error) => {
        console.error('Error al obtener registros del paciente:', error);
      }
    });
  }

  selectRecord(id: number) {
    this.selectedRecordId = id;
  }

  isSelected(id: number): boolean {
    return this.selectedRecordId === id;
  }
}
