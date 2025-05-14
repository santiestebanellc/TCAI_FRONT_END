import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { ChartConfiguration, ChartData } from "chart.js";
import { PatientService } from "../services/patient-service/patient.service";
import { NgChartsModule, BaseChartDirective } from "ng2-charts";
import { ChangeDetectorRef } from "@angular/core";
import 'chartjs-adapter-date-fns';

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
  selector: "app-care-data-summary",
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: "./care-data-summary.component.html",
  styleUrls: ["./care-data-summary.component.css"],
})
export class CareDataSummaryComponent implements OnChanges, OnInit {
  @Input() registroId!: number;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  careData: any = {};
  vitalKeys = ["sys", "dia", "fr", "fc", "take", "spo2"];

  barChartLabels: string[] = [];

  barChartData: ChartData<"line"> = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: "TA Sistólica",
        data: [],
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: "rgba(255, 0, 0, 1)",
        yAxisID: "y",
        spanGaps: true,
      },
      {
        label: "TA Diastólica",
        data: [],
        borderColor: "rgba(0, 0, 255, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: "rgba(0, 0, 255, 1)",
        yAxisID: "y",
        spanGaps: true,
      },
      {
        label: "Pulso",
        data: [],
        borderColor: "rgba(0, 0, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: "rgba(0, 0, 0, 1)",
        yAxisID: "y",
        spanGaps: true,
      },
      {
        label: "Temperatura",
        data: [],
        borderColor: "rgba(0, 128, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: "rgba(0, 128, 0, 1)",
        yAxisID: "y2",
        spanGaps: true,
      },
      {
        label: "Frecuencia Respiratoria",
        data: [],
        borderColor: "rgba(255, 165, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: "rgba(255, 165, 0, 1)",
        yAxisID: "y2",
        spanGaps: true,
      },
      {
        label: "SpO2",
        data: [],
        borderColor: "rgba(128, 0, 128, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: "rgba(128, 0, 128, 1)",
        yAxisID: "y",
        spanGaps: true,
      },
    ],
  };

  barChartOptions: ChartConfiguration<"line">["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "MMM d, yyyy",
          },
          tooltipFormat: "MMM d, yyyy HH:mm",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
      y: {
        position: "left",
        beginAtZero: true,
        min: 0,
        max: 200,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
          stepSize: 20,
        },
      },
      y2: {
        position: "right",
        beginAtZero: true,
        min: 0,
        max: 40,
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
          stepSize: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
      },
    },
    elements: {
      line: {
        tension: 0.1,
        borderWidth: 2,
      },
      point: {
        radius: 5,
        hoverRadius: 7,
      },
    },
  };

  barChartType: "line" = "line";
  hasChartData: boolean = false;

  constructor(private patientService: PatientService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log("ngOnInit - registroId:", this.registroId);
    if (this.registroId) {
      this.fetchCareData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["registroId"]) {
      console.log("ngOnChanges - nuevo registroId:", changes["registroId"].currentValue);
      if (!changes["registroId"].firstChange) {
        this.fetchCareData();
      }
    }
  }

  private fetchCareData(): void {
    if (!this.registroId) {
      console.warn("No registroId provided.");
      return;
    }

    this.patientService.getHistorialByPaciente(this.registroId).subscribe(
      (data: HistorialResponse | any) => {
        console.log("Historial recibido del backend (raw):", data);

        try {
          let historyData: VitalSignsEntry[] = [];
          if (data && typeof data === 'object' && data.success && Array.isArray(data.content)) {
            historyData = data.content;
          } else if (Array.isArray(data)) {
            historyData = data as VitalSignsEntry[];
          } else {
            console.warn("Formato de datos inesperado:", data);
            historyData = [];
          }

          this.careData.vitalSignsHistory = historyData;
          console.log("vitalSignsHistory asignado:", this.careData.vitalSignsHistory);
          this.updateChartData();
        } catch (error) {
          console.error("Error al procesar los datos del historial:", error);
          this.careData.vitalSignsHistory = [];
          this.updateChartData();
        }
      },
      (error) => {
        console.error("Error al obtener el historial del paciente:", error);
        this.careData.vitalSignsHistory = [];
        this.updateChartData();
      }
    );

    this.patientService.getPatientData(this.registroId).subscribe(
      (data) => {
        const registro = data?.content?.registro;
        console.log("Datos del registro actual:", registro);
        if (registro) {
          this.updateCareData(registro);
        } else {
          console.warn("No se encontró el registro con el ID proporcionado.");
        }
      },
      (error) => {
        console.error("Error al obtener los datos del paciente:", error);
      }
    );
  }

  private updateCareData(registro: any): void {
    this.careData.vitalSigns = {
      sys: registro?.constantes_vitales?.ta_sistolica ?? "-",
      dia: registro?.constantes_vitales?.ta_diastolica ?? "-",
      fr: registro?.constantes_vitales?.frecuencia_respiratoria ?? "-",
      fc: registro?.constantes_vitales?.pulso ?? "-",
      take: registro?.constantes_vitales?.temperatura ?? "-",
      spo2: registro?.constantes_vitales?.saturacion_oxigeno ?? "-",
    };

    this.careData.dieta = {
      tipo_dieta: registro?.dieta?.tipo_dieta ?? "-",
      tipo_textura: registro?.dieta?.tipo_textura ?? "-",
      autonomo: registro?.dieta?.autonomo ?? 0,
      protesi: registro?.dieta?.protesi ?? 0,
    };

    this.careData.hygiene = {
      hygieneType: registro?.higiene?.tipo_higiene ?? "-",
      hygieneDescription: registro?.higiene?.higiene_descripcion ?? "-",
    };

    this.careData.fluidTherapy = registro?.sueroterapia ?? "-";
    this.careData.diuresis = registro?.balance_hidrico?.diuresis ?? "-";
    this.careData.bowelMovements = registro?.balance_hidrico?.deposicion ?? "-";

    // Drainage data, matching the old code structure
    this.careData.drainage = {
      type: registro?.drenaje ?? "-",
      debit: registro?.debit ?? "-",
    };

    this.careData.mobility = {
      sitting: registro?.movilizacion?.sedestacion ?? "-",
      walking: registro?.movilizacion?.ayuda_deambulacion ?? "-",
      desc: registro?.movilizacion?.ayuda_descripcion ?? "-",
      postureChanges: registro?.movilizacion?.cambios_posturales ?? "-",
    };

    this.careData.observation = {
      date: registro?.fecha ?? "-",
      authorName: registro?.auxiliar?.nombre ?? "-",
      authorNum: registro?.auxiliar?.num_trabajador ?? "-",
      text: registro?.observacion ?? "-",
    };
  }

  private updateChartData(): void {
    const history = this.careData?.vitalSignsHistory || [];

    console.log("history:", history);

    if (!history.length) {
      console.warn("No hay datos históricos disponibles para mostrar en la gráfica.");
      this.barChartData.datasets.forEach(dataset => dataset.data = []);
      this.barChartLabels = [];
      this.hasChartData = false;
      if (this.chart) {
        this.chart.chart?.update();
      }
      this.cdr.detectChanges();
      return;
    }

    try {
      // Set labels to timestamps
      this.barChartLabels = history.map((entry: VitalSignsEntry) => {
        const timestamp = entry?.timestamp;
        if (!timestamp) {
          console.warn("Timestamp faltante en entrada:", entry);
          return null;
        }
        return new Date(timestamp).toISOString();
      }).filter((label: string | null) => label !== null) as string[];

      console.log("barChartLabels (timestamps):", this.barChartLabels);

      if (!this.barChartLabels.length) {
        console.warn("No se encontraron timestamps válidos para los labels.");
        this.barChartData.datasets.forEach(dataset => dataset.data = []);
        this.hasChartData = false;
        if (this.chart) {
          this.chart.chart?.update();
        }
        this.cdr.detectChanges();
        return;
      }

      // Populate datasets with historical data
      this.barChartData.datasets[0].data = history.map((entry: VitalSignsEntry) => {
        const value = entry?.constantes_vitales?.ta_sistolica;
        return value != null ? Number(value) : null;
      });
      this.barChartData.datasets[1].data = history.map((entry: VitalSignsEntry) => {
        const value = entry?.constantes_vitales?.ta_diastolica;
        return value != null ? Number(value) : null;
      });
      this.barChartData.datasets[2].data = history.map((entry: VitalSignsEntry) => {
        const value = entry?.constantes_vitales?.pulso;
        return value != null ? Number(value) : null;
      });
      this.barChartData.datasets[3].data = history.map((entry: VitalSignsEntry) => {
        const value = entry?.constantes_vitales?.temperatura;
        return value != null ? Number(value) : null;
      });
      this.barChartData.datasets[4].data = history.map((entry: VitalSignsEntry) => {
        const value = entry?.constantes_vitales?.frecuencia_respiratoria;
        return value != null ? Number(value) : null;
      });
      this.barChartData.datasets[5].data = history.map((entry: VitalSignsEntry) => {
        const value = entry?.constantes_vitales?.spo2;
        return value != null ? Number(value) : null;
      });

      console.log("Datasets poblados:", this.barChartData.datasets);

      // Update the chart's labels
      this.barChartData.labels = this.barChartLabels;

      this.hasChartData = this.barChartData.datasets.some(dataset => dataset.data.some(val => val !== null));
      console.log("¿Tiene datos la gráfica? ", this.hasChartData);

      if (!this.hasChartData) {
        console.warn("No hay datos válidos en los datasets para mostrar.");
      }

      if (this.chart) {
        console.log("Actualizando gráfica con datos:", this.barChartData);
        this.chart.chart?.update();
      } else {
        console.warn("No se encontró la referencia al componente de la gráfica.");
      }

      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error al actualizar los datos de la gráfica:", error);
      this.barChartData.datasets.forEach(dataset => dataset.data = []);
      this.barChartLabels = [];
      this.hasChartData = false;
      if (this.chart) {
        this.chart.chart?.update();
      }
      this.cdr.detectChanges();
    }
  }
}