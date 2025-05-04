import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActualRoomService {
  private actualRoomSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('actualRoom')
  ); // Inicializa con el estado actual
  actualRoom$ = this.actualRoomSubject.asObservable();
  constructor() {}

  getActualRoom() {
    return this.actualRoom$;
  }

  setActualRoom(roomNumber: string) {
    localStorage.setItem('actualRoom', roomNumber);
    this.actualRoomSubject.next(roomNumber);
  }

  resetActualRoom() {
    localStorage.removeItem('actualRoom');
    this.actualRoomSubject.next(null);
  }
}
