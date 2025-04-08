import { Patient } from './patient';

export interface Room {
  id: number;
  patient: Patient;
  medicalData: string;
  dietData: string;
  summary: string;
}
