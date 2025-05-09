import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient-service/patient.service';

@Component({
  selector: 'app-medical-data-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-data-form.component.html',
  styleUrls: ['./medical-data-form.component.css']
})
export class MedicalDataFormComponent {
  mobility = ""
  oxygenTherapy = ""
  oxygenType = ""
  diaperUse = ""
  diaperChanges: number | null = null
  perinealSkinCondition = ""
  urinaryCatheter = ""
  nasogastricTubePosition = ""
  nasogastricTubeObservations = ""
  rectalTube = ""

  // Logged nurse
  userNombre = localStorage.getItem('userNombre');
  userApellidos = localStorage.getItem('userApellidos');
  numTrabajador = localStorage.getItem('numTrabajador');
  userId = localStorage.getItem('userId');

  // Selected patient
  pacienteId: number | null = null;
  habitacionCodigo: string | null = null;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.patientData$.subscribe(data => {
      if (data) {
        this.pacienteId = data.pacienteId;
        this.habitacionCodigo = data.habitacionCodigo;
      }
    });
  }

  saveForm() {
    console.log({
      mobility: this.mobility,
      oxygenTherapy: this.oxygenTherapy,
      oxygenType: this.oxygenType,
      diaperUse: this.diaperUse,
      diaperChanges: this.diaperChanges,
      perinealSkinCondition: this.perinealSkinCondition,
      urinaryCatheter: this.urinaryCatheter,
      nasogastricTubePosition: this.nasogastricTubePosition,
      nasogastricTubeObservations: this.nasogastricTubeObservations,
      rectalTube: this.rectalTube,
    })
  }



}