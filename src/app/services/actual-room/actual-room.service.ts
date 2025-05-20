import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActualRoomService {
  private actualRoomSubject = new BehaviorSubject< string | null >(
    localStorage.getItem('actualRoom')
  ); // Inicializa con el estado actual
  actualRoom$ = this.actualRoomSubject.asObservable();

  private actualPatientSubject = new BehaviorSubject< string | null >(
    localStorage.getItem('actualPatient')
  ); // Inicializa con el estado actual
  actualPatient$ = this.actualPatientSubject.asObservable();

  constructor() {}

  getActualRoomAndPatient() {
    return [this.actualRoom$, this.actualPatient$];
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
