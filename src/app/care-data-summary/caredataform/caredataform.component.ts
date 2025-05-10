import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
// import { CareDataService } from '../services/care-data.service'; // Import the service

// Interface to structure the form data
interface Vitals {
  systolic: number | null;
  diastolic: number | null;
  respiratoryRate: number | null;
  pulse: number | null;
  temperature: number | null;
  oxygenSaturation: number | null;
}

interface Sueroterapia {
  totalVolume: number | null;
  observations: string;
}

interface BalancHidric {
  urineOutput: number | null;
  stoolVolume: string;
}

interface Drenatges {
  drainageType: string;
  drainageFlow: number | null;
}

interface CareData {
  vitals: Vitals;
  sueroterapia: Sueroterapia;
  balancHidric: BalancHidric;
  drenatges: Drenatges;
  higiene: string[];
  observations: string;
}

@Component({
  selector: 'app-caredataform',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './caredataform.component.html',
  styleUrls: ['./caredataform.component.css'],
})
export class CaredataformComponent {
  // Form data properties
  vitals: Vitals = {
    systolic: null,
    diastolic: null,
    respiratoryRate: null,
    pulse: null,
    temperature: null,
    oxygenSaturation: null,
  };

  sueroterapia: Sueroterapia = {
    totalVolume: null,
    observations: '',
  };

  balancHidric: BalancHidric = {
    urineOutput: null,
    stoolVolume: '',
  };

  drenatges: Drenatges = {
    drainageType: '',
    drainageFlow: null,
  };

  higiene: string[] = []; // Array to store selected hygiene levels
  observations: string = '';

  // constructor(private careDataService: CareDataService) {} // Inject the service

  saveCareForm() {
    // Structure the form data
    const formData: CareData = {
      vitals: this.vitals,
      sueroterapia: this.sueroterapia,
      balancHidric: this.balancHidric,
      drenatges: this.drenatges,
      higiene: this.higiene,
      observations: this.observations,
    };

    /*  // Send the data to the backend via the service
    this.careDataService.saveCareData(formData).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
        // Optionally reset the form or show a success message
        this.resetForm();
      },
      error: (error) => {
        console.error('Error saving data:', error);
        // Handle the error (e.g., show an error message to the user)
      }
    }); */
  }

  // Optional: Reset the form after submission
  private resetForm() {
    this.vitals = {
      systolic: null,
      diastolic: null,
      respiratoryRate: null,
      pulse: null,
      temperature: null,
      oxygenSaturation: null,
    };
    this.sueroterapia = {
      totalVolume: null,
      observations: '',
    };
    this.balancHidric = {
      urineOutput: null,
      stoolVolume: '',
    };
    this.drenatges = {
      drainageType: '',
      drainageFlow: null,
    };
    this.higiene = [];
    this.observations = '';
  }
}
