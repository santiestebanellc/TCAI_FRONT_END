import { Component, OnInit } from '@angular/core';
import { HistoricalMedicalComponent } from "../historical-medical/historical-medical.component";
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';

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
  imports: [HistoricalMedicalComponent, HistoricalMedicalComponent, ButtonComponent],
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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToAddMedicalData() {
    this.router.navigate(['/add-medical-data']);
  }

}
