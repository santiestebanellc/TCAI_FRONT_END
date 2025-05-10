import { Component, Input, type OnChanges, type SimpleChanges, type OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import type { ChartConfiguration } from "chart.js"; // Note: No need for ChartType import
import { PatientService } from "../services/patient-service/patient.service";
import { NgChartsModule, BaseChartDirective } from "ng2-charts";

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

  // Etiquetas para el eje X (pueden ser fechas u horas)
  barChartLabels: string[] = ["8h", "12h", "16h", "20h", "24h", "4h"];

  barChartData: ChartConfiguration<"line">["data"] = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: "TA Sistólica",
        data: [120, 125, 118, 130, 122, 119],
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 0, 0, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        fill: false,
        tension: 0.2,
      },
      {
        label: "TA Diastólica",
        data: [80, 85, 78, 88, 82, 79],
        borderColor: "rgba(0, 0, 255, 1)",
        backgroundColor: "rgba(0, 0, 255, 0)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 0, 255, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        fill: false,
        tension: 0.2,
      },
      {
        label: "Pulso",
        data: [72, 78, 75, 80, 76, 74],
        borderColor: "rgba(0, 0, 0, 1)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 0, 0, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        fill: false,
        tension: 0.2,
      },
      {
        label: "Temperatura",
        data: [36.5, 36.8, 37.1, 36.9, 36.7, 36.6],
        borderColor: "rgba(0, 128, 0, 1)",
        backgroundColor: "rgba(0, 128, 0, 0)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 128, 0, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
        fill: false,
        tension: 0.2,
      },
    ],
  };

  barChartOptions: ChartConfiguration<"line">["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
      y: {
        position: "left",
        beginAtZero: false,
        min: 30,
        max: 300,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    elements: {
      line: {
        tension: 0.2,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6,
      },
    },
  };

  barChartType: "line" = "line"; // Explicitly typed as "line"

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    if (this.registroId) {
      this.fetchCareData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["registroId"] && !changes["registroId"].firstChange) {
      this.fetchCareData();
    }
  }

  private fetchCareData(): void {
    if (!this.registroId) {
      console.warn("No registroId provided.");
      return;
    }

    this.patientService.getPatientData(this.registroId).subscribe(
      (data) => {
        const registro = data?.content?.registro;
        if (registro) {
          this.updateCareData(registro);
          this.updateChartData();
        } else {
          console.warn("No data found for the provided registroId.");
        }
      },
      (error) => {
        console.error("Error fetching care data:", error);
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
    const sys = this.careData.vitalSigns.sys !== "-" ? Number(this.careData.vitalSigns.sys) : null;
    const dia = this.careData.vitalSigns.dia !== "-" ? Number(this.careData.vitalSigns.dia) : null;
    const fc = this.careData.vitalSigns.fc !== "-" ? Number(this.careData.vitalSigns.fc) : null;
    const temp = this.careData.vitalSigns.take !== "-" ? Number(this.careData.vitalSigns.take) : null;

    if (sys !== null) {
      this.barChartData.datasets[0].data[this.barChartData.datasets[0].data.length - 1] = sys;
    }

    if (dia !== null) {
      this.barChartData.datasets[1].data[this.barChartData.datasets[1].data.length - 1] = dia;
    }

    if (fc !== null) {
      this.barChartData.datasets[2].data[this.barChartData.datasets[2].data.length - 1] = fc;
    }

    if (temp !== null) {
      this.barChartData.datasets[3].data[this.barChartData.datasets[3].data.length - 1] = temp;
    }

    if (this.chart) {
      this.chart.update();
    }
  }
}