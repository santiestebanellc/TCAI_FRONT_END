import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Record {
  id: number;  // Añadido para identificar cada registro de forma única
  time: string;
  date: string;
  name: string;
  shift: string;
  diagnosis: string | null;
  notes: string;
  priority: boolean;
}

@Component({
  selector: 'app-historical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css'],
})
export class HistoricalComponent implements OnInit {
  records: Record[] = [];
  selectedRecordId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.records = [
      {
        id: 1,
        time: '15:37h',
        date: '18/02/2025',
        name: 'Joan Martínez',
        shift: 'tarda',
        diagnosis: 'Hipertensió',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: true,
      },
      {
        id: 2,
        time: '06:37h',
        date: '18/02/2025',
        name: 'Maria López',
        shift: 'matí',
        diagnosis: 'Grip',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: false,
      },
      {
        id: 3,
        time: '21:37h',
        date: '17/02/2025',
        name: 'Pere Ferrer',
        shift: 'nit',
        diagnosis: null,
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: false,
      },
      {
        id: 4,
        time: '21:37h',
        date: '17/02/2025',
        name: 'Arnau Colominas',
        shift: 'nit',
        diagnosis: null,
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: false,
      },
    ];
  }

  /**
   * Selecciona un registro cuando se hace clic en él
   */
  selectRecord(id: number): void {
    this.selectedRecordId = id;
  }

  /**
   * Verifica si un registro está seleccionado
   */
  isSelected(id: number): boolean {
    return this.selectedRecordId === id;
  }
}