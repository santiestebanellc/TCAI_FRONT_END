import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Room {
  id: number;
  name: string;
  generalInfo: string;
  dietInfo: string;
}

@Component({
  selector: 'app-rooms',
  imports: [CommonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent {
  type: string = '';
  rooms: Room[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.type = params['type']; // 'general' o 'diets'
      this.loadRooms();
    });
  }

  loadRooms() {
    // Lista de habitaciones con ambas informaciones
    const allRooms: Room[] = [
      {
        id: 1,
        name: 'Room 101',
        generalInfo: 'Flu',
        dietInfo: 'Menú sense ou',
      },
      {
        id: 2,
        name: 'Room 102',
        generalInfo: 'Headache',
        dietInfo: 'Menu liquid',
      },
    ];

    // Muestra TODAS las habitaciones y solo la info de la ruta
    this.rooms = allRooms;
  }
}
