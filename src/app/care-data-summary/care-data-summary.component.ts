import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-care-data-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './care-data-summary.component.html',
  styleUrl: './care-data-summary.component.css'
})
export class CareDataSummaryComponent implements OnInit {
  careData: any = {};

  constructor() {}

  ngOnInit(): void {
    this.careData = {
      vitalSigns: {
        heartRate: 89,           // bpm
        bloodPressure: '108/68', // mmHg
        oxygenSaturation: 99,    // %
        respiratoryRate: 16,     // rpm
        temperature: 36.8        // °C
      },
      drainage: {
        flow: 'dèbit',
        type: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.'
      },
      mobility: {
        sittingTolerance: 'tolerància',
        walking: 'Amb ajuda [icon], bastó',
        postureChanges: 'Horari, decúbits'
      },
      hygiene: {
        dietType: 'Diabètica',
        texture: 'Tova',
        assistance: 'Autònom',
        prosthesis: 'Sí'
      },
      diet: {
        dietType: 'Diabètica',
        texture: 'Tova',
        assistance: 'Autònom',
        prosthesis: 'Sí'
      },
      fluidTherapy: '50mL',
      diuresis: '50mL',
      bowelMovements: ['✕', '✕', '✕'],
      observation: {
        date: '12/07/2025 13:10h',
        author: 'Arnau Colominas',
        text: 'Lorem ipsum dolor sit amsitsitsitsitsitsitsitsitsitsitsitsitsitsitsitsitsitsitsitsitet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.'
      }
    };
  }
}
