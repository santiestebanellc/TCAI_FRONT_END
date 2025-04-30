import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient-service/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-care-data-summary',
  imports: [CommonModule, FormsModule], 
  templateUrl: './care-data-summary.component.html',
  styleUrls: ['./care-data-summary.component.css']
})
export class CareDataSummaryComponent implements OnInit {
  careData: any = {}; // Definimos careData como un objeto vacío

  // Claves para mostrar en la interfaz de signos vitales
  vitalKeys = ['ta_sistolica', 'ta_diastolica', 'frecuencia_respiratoria', 'temperatura', 'saturacion_oxigeno'];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    // Llamada al servicio para obtener los datos del paciente
    this.patientService.getCareDataByPaciente(1).subscribe(
      (data) => {
        console.log(data); // Verifica los datos devueltos
        if (data && data.content && data.content.registro) {
          const registro = data.content.registro;

          if (registro) {
            this.updateCareData(registro);
          } else {
            console.warn('❗ Datos de atención del paciente no disponibles');
          }
        } else {
          console.warn('❗ No se encontraron datos de atención del paciente');
        }
      },
      (error) => {
        console.error('❌ Error al obtener los datos de atención del paciente', error);
      }
    );
  }

  // Método para actualizar los datos de careData
  private updateCareData(registro: any): void {
    this.careData.vitalSigns = registro?.constantes_vitales || {};

    // Actualización de los datos de dieta
    this.careData.dieta = {
      tipo_dieta: registro?.dieta?.tipo_dieta || 'No disponible',
      tipo_textura: registro?.dieta?.tipo_textura || 'No disponible',
      autonomo: registro?.dieta?.autonomo || 0,
      protesi: registro?.dieta?.protesi || 0
    };

    // Actualización de los datos de higiene
    this.careData.hygiene = {
      dietType: registro?.higiene?.tipo_higiene || 'No disponible',
      texture: registro?.higiene?.higiene_descripcion || 'No disponible',
      assistance: registro?.higiene?.tipo_higiene || 'No disponible',
      prosthesis: registro?.higiene?.higiene_descripcion || 'No disponible'
    };

    // Actualización de los datos de fluidoterapia y diuresis
    this.careData.fluidTherapy = registro?.sueroterapia || 'No disponible';
    this.careData.diuresis = registro?.balance_hidrico?.diuresis || 'No disponible';

    // Actualización de los movimientos intestinales
    this.careData.bowelMovements = registro?.balance_hidrico?.deposicion || 'No disponible';

    // Actualización de los datos de drenaje
    this.careData.drainage = {
      type: registro?.drenaje || 'No disponible',
      debit: registro?.debit || 'No disponible'
    };

    // Actualización de los datos de movilidad
    this.careData.mobility = {
      sitting: registro?.movilizacion?.sedestacion || 'No disponible',
      walking: registro?.movilizacion?.ayuda_deambulacion || 'No disponible',
      postureChanges: registro?.movilizacion?.cambios_posturales || 'No disponible'
    };

    // Actualización de la observación
    this.careData.observation = {
      date: registro?.fecha || 'No disponible',
      author: registro?.autor || 'No disponible',
      text: registro?.texto_observacion || 'No disponible'
    };
  }
}


