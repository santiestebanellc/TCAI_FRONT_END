import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { ChartConfiguration, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { PatientService } from '../services/patient-service/patient.service';

// Define the structure of the vital signs history entry
interface VitalSignsEntry {
  timestamp: string;
  constantes_vitales: {
    ta_sistolica: string;
    ta_diastolica: string;
    pulso: string;
    temperatura: string;
    frecuencia_respiratoria: string;
    spo2: string;
  };
}

// Define the structure of the API response
interface HistorialResponse {
  success: boolean;
  content: VitalSignsEntry[];
}

@Component({
  selector: 'app-care-data-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './care-data-summary.component.html',
  styleUrls: ['./care-data-summary.component.css'],
})
export class CareDataSummaryComponent
  implements OnChanges, OnInit, AfterViewInit
{
  @Input() registroId!: number;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() filter: string | null = null;

  careData: any = {};
  vitalKeys = ['sys', 'dia', 'fr', 'fc', 'temp', 'spo2'];
  isLoadingChart: boolean = true;
  pacienteId: number | null = null;

  barChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'TA Sistólica',
        data: [],
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(255, 0, 0, 1)',
        yAxisID: 'y',
        spanGaps: true,
        tension: 0.3,
      },
      {
        label: 'TA Diastólica',
        data: [],
        borderColor: 'rgba(0, 0, 255, 1)',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(0, 0, 255, 1)',
        yAxisID: 'y',
        spanGaps: true,
        tension: 0.3,
      },
      {
        label: 'Pulso',
        data: [],
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
        yAxisID: 'y',
        spanGaps: true,
        tension: 0.3,
      },
      {
        label: 'Temperatura',
        data: [],
        borderColor: 'rgba(0, 128, 0, 1)',
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(0, 128, 0, 1)',
        yAxisID: 'y2',
        spanGaps: true,
        tension: 0.3,
      },
      {
        label: 'Frecuencia Respiratoria',
        data: [],
        borderColor: 'rgba(255, 165, 0, 1)',
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(255, 165, 0, 1)',
        yAxisID: 'y',
        spanGaps: true,
        tension: 0.3,
      },
      {
        label: 'SpO2',
        data: [],
        borderColor: 'rgba(128, 0, 128, 1)',
        backgroundColor: 'rgba(128, 0, 128, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(128, 0, 128, 1)',
        yAxisID: 'y',
        spanGaps: true,
        tension: 0.3,
      },
    ],
  };

  barChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd/MM',
            hour: 'HH:mm',
          },
          tooltipFormat: 'dd/MM/yyyy HH:mm',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          maxRotation: 45,
          minRotation: 0,
        },
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: false,
        min: 40,
        max: 200,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          stepSize: 20,
        },
        title: {
          display: true,
          text: 'TA / Pulso / SpO2',
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: false,
        min: 34,
        max: 42,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(0, 128, 0, 0.7)',
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        padding: 12,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function (context) {
            if (context[0]?.parsed?.x) {
              const date = new Date(context[0].parsed.x);
              return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }
            return '';
          },
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Temperatura') {
                label += context.parsed.y + '°C';
              } else if (context.dataset.label === 'SpO2') {
                label += context.parsed.y + '%';
              } else if (context.dataset.label?.includes('TA')) {
                label += context.parsed.y + ' mmHg';
              } else if (context.dataset.label === 'Pulso') {
                label += context.parsed.y + ' bpm';
              } else if (context.dataset.label === 'Frecuencia Respiratoria') {
                label += context.parsed.y + ' rpm';
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  barChartType: 'line' = 'line';
  hasChartData: boolean = false;

  constructor(
    private patientService: PatientService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - registroId:', this.registroId);
    if (this.registroId) {
      this.fetchCareData();
    }
  }

  ngAfterViewInit(): void {
    // Ensure chart is properly initialized after view is ready
    setTimeout(() => {
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registroId'] && changes['registroId'].currentValue) {
      console.log(
        'ngOnChanges - nuevo registroId:',
        changes['registroId'].currentValue
      );
      this.fetchCareData();
    }
  }

  private fetchCareData(): void {
    if (!this.registroId) {
      console.warn('No registroId provided.');
      return;
    }

    this.isLoadingChart = true;

    // Primero obtenemos los datos actuales del paciente para obtener el ID del paciente
    this.patientService.getPatientData(this.registroId).subscribe({
      next: (data) => {
        const registro = data?.content?.registro;
        console.log('Datos del registro actual:', registro);

        if (registro) {
          this.updateCareData(registro);

          // Extraer el ID del paciente del registro
          this.pacienteId =
            registro?.paciente_id?.id || registro?.paciente?.id || null;

          console.log('ID del paciente extraído:', this.pacienteId);

          if (this.pacienteId) {
            // Ahora obtenemos el historial usando el ID del paciente
            this.fetchPatientHistory(this.pacienteId);
          } else {
            console.warn('No se pudo obtener el ID del paciente del registro');
            this.isLoadingChart = false;
            this.hasChartData = false;
          }
        } else {
          console.warn('No se encontró el registro con el ID proporcionado.');
          this.isLoadingChart = false;
          this.hasChartData = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del paciente:', error);
        this.isLoadingChart = false;
        this.hasChartData = false;
      },
    });
  }

  private fetchPatientHistory(pacienteId: number): void {
    console.log('Obteniendo historial para paciente ID:', pacienteId);

    // Usar el método correcto del servicio para obtener el historial por ID de paciente
    this.patientService.getHistorialByPaciente(pacienteId).subscribe({
      next: (data: HistorialResponse | any) => {
        console.log('Historial recibido del backend (raw):', data);
        this.isLoadingChart = false;

        try {
          let historyData: VitalSignsEntry[] = [];

          if (
            data &&
            typeof data === 'object' &&
            data.success &&
            Array.isArray(data.content)
          ) {
            historyData = data.content;
          } else if (Array.isArray(data)) {
            historyData = data as VitalSignsEntry[];
          } else {
            console.warn('Formato de datos inesperado:', data);
            historyData = [];
          }

          console.log('Datos históricos extraídos:', historyData);

          if (!historyData || historyData.length === 0) {
            console.warn('No se encontraron datos históricos');
            this.hasChartData = false;
            return;
          }

          // Sort data by timestamp to ensure chronological order
          historyData.sort((a, b) => {
            return (
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          });

          this.careData.vitalSignsHistory = historyData;
          console.log(
            'vitalSignsHistory asignado:',
            this.careData.vitalSignsHistory
          );

          this.updateChartData();
        } catch (error) {
          console.error('Error al procesar los datos del historial:', error);
          this.careData.vitalSignsHistory = [];
          this.hasChartData = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener el historial del paciente:', error);
        this.careData.vitalSignsHistory = [];
        this.isLoadingChart = false;
        this.hasChartData = false;
      },
    });
  }

  private updateCareData(registro: any): void {
    this.careData.vitalSigns = {
      sys: registro?.constantes_vitales?.ta_sistolica ?? '-',
      dia: registro?.constantes_vitales?.ta_diastolica ?? '-',
      fr: registro?.constantes_vitales?.frecuencia_respiratoria ?? '-',
      fc: registro?.constantes_vitales?.pulso ?? '-',
      temp: registro?.constantes_vitales?.temperatura ?? '-',
      spo2: registro?.constantes_vitales?.saturacion_oxigeno ?? '-',
    };

    this.careData.dieta = {
      tipo_dieta: registro?.dieta?.tipo_dieta ?? '-',
      tipo_textura: registro?.dieta?.tipo_textura ?? '-',
      autonomo: registro?.dieta?.autonomo ?? 0,
      protesi: registro?.dieta?.protesi ?? 0,
    };

    this.careData.hygiene = {
      hygieneType: registro?.higiene?.tipo_higiene ?? '-',
      hygieneDescription: registro?.higiene?.higiene_descripcion ?? '-',
    };

    this.careData.fluidTherapy = registro?.sueroterapia ?? '-';
    this.careData.diuresis = registro?.balance_hidrico?.diuresis ?? '-';
    this.careData.bowelMovements = registro?.balance_hidrico?.deposicion ?? '-';

    this.careData.drainage = {
      type: registro?.drenaje ?? '-',
      debit: registro?.debit ?? '-',
    };

    this.careData.mobility = {
      sitting: registro?.movilizacion?.sedestacion ?? '-',
      walking: registro?.movilizacion?.ayuda_deambulacion ?? '-',
      desc: registro?.movilizacion?.ayuda_descripcion ?? '-',
      postureChanges: registro?.movilizacion?.cambios_posturales ?? '-',
    };

    this.careData.observation = {
      date: registro?.fecha ?? '-',
      authorName: registro?.auxiliar?.nombre ?? '-',
      authorNum: registro?.auxiliar?.num_trabajador ?? '-',
      text: registro?.observacion ?? '-',
    };
  }

  private updateChartData(): void {
    const history = this.careData?.vitalSignsHistory || [];

    console.log('history:', history);

    if (!history.length) {
      console.warn(
        'No hay datos históricos disponibles para mostrar en la gráfica.'
      );
      this.hasChartData = false;
      return;
    }

    try {
      // Para gráficos basados en tiempo, necesitamos usar objetos {x, y} donde x es un timestamp
      const sistolicaData: { x: number; y: number }[] = [];
      const diastolicaData: { x: number; y: number }[] = [];
      const pulsoData: { x: number; y: number }[] = [];
      const temperaturaData: { x: number; y: number }[] = [];
      const frecuenciaData: { x: number; y: number }[] = [];
      const spo2Data: { x: number; y: number }[] = [];

      // Procesar cada entrada del historial
      history.forEach((entry: VitalSignsEntry) => {
        // Verificar si tenemos un timestamp válido
        if (!entry.timestamp) {
          console.warn('Entrada sin timestamp:', entry);
          return;
        }

        const date = new Date(entry.timestamp);

        if (isNaN(date.getTime())) {
          console.warn('Timestamp inválido:', entry.timestamp);
          return;
        }

        const timeValue = date.getTime();

        // Obtener constantes vitales
        const constantes = entry.constantes_vitales;

        if (!constantes) {
          console.warn('Entrada sin constantes vitales:', entry);
          return;
        }

        // Añadir puntos de datos (solo valores válidos)
        if (constantes.ta_sistolica) {
          const value = Number(constantes.ta_sistolica);
          if (!isNaN(value) && value > 0) {
            sistolicaData.push({ x: timeValue, y: value });
          }
        }

        if (constantes.ta_diastolica) {
          const value = Number(constantes.ta_diastolica);
          if (!isNaN(value) && value > 0) {
            diastolicaData.push({ x: timeValue, y: value });
          }
        }

        if (constantes.pulso) {
          const value = Number(constantes.pulso);
          if (!isNaN(value) && value > 0) {
            pulsoData.push({ x: timeValue, y: value });
          }
        }

        if (constantes.temperatura) {
          const value = Number(constantes.temperatura);
          if (!isNaN(value) && value > 0) {
            temperaturaData.push({ x: timeValue, y: value });
          }
        }

        if (constantes.frecuencia_respiratoria) {
          const value = Number(constantes.frecuencia_respiratoria);
          if (!isNaN(value) && value > 0) {
            frecuenciaData.push({ x: timeValue, y: value });
          }
        }

        if (constantes.spo2) {
          const value = Number(constantes.spo2);
          if (!isNaN(value) && value > 0) {
            spo2Data.push({ x: timeValue, y: value });
          }
        }
      });

      // Actualizar datos del gráfico
      this.barChartData.datasets[0].data = sistolicaData;
      this.barChartData.datasets[1].data = diastolicaData;
      this.barChartData.datasets[2].data = pulsoData;
      this.barChartData.datasets[3].data = temperaturaData;
      this.barChartData.datasets[4].data = frecuenciaData;
      this.barChartData.datasets[5].data = spo2Data;

      console.log('Datasets poblados:', this.barChartData.datasets);

      // Verificar si tenemos datos válidos
      this.hasChartData = this.barChartData.datasets.some(
        (dataset) => dataset.data && dataset.data.length > 0
      );

      console.log('¿Tiene datos la gráfica? ', this.hasChartData);

      if (this.hasChartData) {
        this.updateChart();
      } else {
        console.warn('No hay datos válidos en los datasets para mostrar.');
      }
    } catch (error) {
      console.error('Error al actualizar los datos de la gráfica:', error);
      this.hasChartData = false;
    }
  }

  private updateChart(): void {
    // Use setTimeout to ensure the chart update happens after Angular's change detection
    setTimeout(() => {
      if (this.chart && this.chart.chart) {
        console.log('Actualizando gráfica con datos:', this.barChartData);
        this.chart.chart.update('none'); // 'none' prevents animation on update
      } else {
        console.warn(
          'No se encontró la referencia al componente de la gráfica.'
        );
      }
      this.cdr.detectChanges();
    }, 0);
  }
}
