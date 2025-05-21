import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface RoomPatientInfo {
  roomNumber: string | null;
  patientId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ActualRoomService {
  private roomPatientSubject = new BehaviorSubject<RoomPatientInfo>({
    roomNumber: localStorage.getItem('actualRoom'),
    patientId: localStorage.getItem('actualPatient'),
  });

  roomPatient$ = this.roomPatientSubject.asObservable();

  constructor() {}

  getCurrentRoomAndPatient(): RoomPatientInfo {
    return this.roomPatientSubject.getValue();
  }

  setRoomAndPatient(roomNumber: string, patientId: string) {
    localStorage.setItem('actualRoom', roomNumber);
    localStorage.setItem('actualPatient', patientId);
    this.roomPatientSubject.next({ roomNumber, patientId });
  }

  resetRoomAndPatient() {
    localStorage.removeItem('actualRoom');
    localStorage.removeItem('actualPatient');
    this.roomPatientSubject.next({ roomNumber: null, patientId: null });
  }
}
