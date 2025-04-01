import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Record {
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

  constructor() {}

  ngOnInit(): void {
    this.records = [
      {
        time: '15:37h',
        date: '18/02/2025',
        name: 'Joan Martínez',
        shift: 'tarda',
        diagnosis: 'Hipertensió',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: true,
      },
      {
        time: '06:37h',
        date: '18/02/2025',
        name: 'Maria López',
        shift: 'matí',
        diagnosis: 'Grip',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: false,
      },
      {
        time: '21:37h',
        date: '17/02/2025',
        name: 'Pere Ferrer',
        shift: 'nit',
        diagnosis: null,
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.',
        priority: false,
      },
      {
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
}