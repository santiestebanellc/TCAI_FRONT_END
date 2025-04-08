import { Component, OnInit } from '@angular/core';

interface MedicalData {
  mobilitat: string;
  portadorO2: string;
  portadorO2Details?: string;
  bolquers: string;
  numCanvis: string;
  estatPell: string;
  sv: string;
  sr: string;
  sng: string;
}

@Component({
  selector: 'app-medical-data',
  imports: [],
  templateUrl: './medical-data.component.html',
  styleUrl: './medical-data.component.css',
})
export class MedicalDataComponent implements OnInit {
  formData: MedicalData = {
    mobilitat: 'Autònom AVD',
    portadorO2: 'No',
    portadorO2Details: 'No requiere oxígeno suplementario',
    bolquers: 'Sí',
    numCanvis: '3',
    estatPell: 'Piel seca, sin lesiones visibles',
    sv: 'Sin datos relevantes',
    sr: 'Sin datos relevantes',
    sng: 'Sin datos relevantes',
  };

  constructor() {}

  ngOnInit(): void {}
}
