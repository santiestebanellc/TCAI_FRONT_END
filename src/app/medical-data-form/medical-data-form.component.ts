import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

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