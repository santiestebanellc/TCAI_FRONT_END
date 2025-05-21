import { CommonModule } from '@angular/common';
import { Component, Input, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ActualPageService } from '../services/actual-page-service/actual-page.service';
import { ActualRoomService } from '../services/actual-room/actual-room.service';

@Component({
  selector: 'app-header-title',
  standalone: true,
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class HeaderTitleComponent {
  @Input() showBackButton: boolean = true;
  @Input() showForwardButton: boolean = true;

  title: Signal<string[]>;

  constructor(
    private actualPageService: ActualPageService,
    private actualRoomService: ActualRoomService,
    private router: Router
  ) {
    this.title = this.actualPageService.activeTitle;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const noFlechasRoutes = [
          '/rooms/general',
          '/rooms/diets',
          '/alerts',
          '/add-medical-data',
        ];

        this.showBackButton = !noFlechasRoutes.includes(
          event.urlAfterRedirects
        );
        this.showForwardButton = !noFlechasRoutes.includes(
          event.urlAfterRedirects
        );
      });
  }

  get subtitle(): string {
    return this.title()[0] || '';
  }

  get mainTitle(): string {
    return this.title()[1] || '';
  }

  private extractRoomNumber(): number {
    return parseInt(this.mainTitle.replace('H', '')) || 1;
  }

  private formatRoomCode(num: number): string {
    return `H${num.toString().padStart(3, '0')}`;
  }

  private activateRoom(habitacionCodigo: string) {
    const habitacionesRaw = localStorage.getItem('habitaciones');
    const habitaciones = JSON.parse(habitacionesRaw || '[]');
    console.log('Habitaciones cargadas:', habitaciones);
    console.log('Buscando habitación con código:', habitacionCodigo);

    const habitacion = habitaciones.find(
      (h: any) =>
        h.habitacion_codigo?.toLowerCase?.().trim?.() ===
        habitacionCodigo.toLowerCase().trim?.()
    );

    console.log('Habitación encontrada:', habitacion);

    const pacienteId =
      habitacion?.paciente?.id ??
      habitacion?.paciente_id ??
      habitacion?.pacienteID ??
      habitacion?.id_paciente;

    const patientData = pacienteId
      ? { pacienteId, habitacionCodigo }
      : { habitacionCodigo };

    localStorage.setItem('patientData', JSON.stringify(patientData));
    this.actualRoomService.setRoomAndPatient(habitacionCodigo, pacienteId);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/care-data']);
    });
  }

  private navigateToMedicalData(habitacionCodigo: string) {
    const habitacionesRaw = localStorage.getItem('habitaciones');
    const habitaciones = JSON.parse(habitacionesRaw || '[]');

    const habitacion = habitaciones.find(
      (h: any) =>
        h.habitacion_codigo?.toLowerCase?.().trim?.() ===
        habitacionCodigo.toLowerCase().trim?.()
    );

    console.log('Redirigiendo a /medical-data con:', habitacion);

    const pacienteId =
      habitacion?.paciente?.id ??
      habitacion?.paciente_id ??
      habitacion?.pacienteID ??
      habitacion?.id_paciente;

    if (!pacienteId) {
      console.warn(
        `No se encontró paciente para habitación ${habitacionCodigo}`
      );
      return;
    }

    localStorage.setItem(
      'patientData',
      JSON.stringify({ pacienteId, habitacionCodigo })
    );

    this.actualRoomService.setRoomAndPatient(habitacionCodigo, pacienteId);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/medical-data']);
    });
  }

  private navigateToPersonalData(habitacionCodigo: string) {
    const habitacionesRaw = localStorage.getItem('habitaciones');
    const habitaciones = JSON.parse(habitacionesRaw || '[]');

    const habitacion = habitaciones.find(
      (h: any) =>
        h.habitacion_codigo?.toLowerCase?.().trim?.() ===
        habitacionCodigo.toLowerCase().trim?.()
    );

    console.log('Redirigiendo a /personal-data con:', habitacion);

    const pacienteId =
      habitacion?.paciente?.id ??
      habitacion?.paciente_id ??
      habitacion?.pacienteID ??
      habitacion?.id_paciente;

    if (!pacienteId) {
      console.warn(
        `No se encontró paciente para habitación ${habitacionCodigo}`
      );
      return;
    }

    localStorage.setItem(
      'patientData',
      JSON.stringify({ pacienteId, habitacionCodigo })
    );

    this.actualRoomService.setRoomAndPatient(habitacionCodigo, pacienteId);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/personal-data']);
    });
  }

  goToPreviousRoom() {
    const num = this.extractRoomNumber();
    if (num <= 1) return;

    const newCode = this.formatRoomCode(num - 1);

    switch (this.router.url) {
      case '/care-data':
        this.activateRoom(newCode);
        break;
      case '/medical-data':
        this.navigateToMedicalData(newCode);
        break;
      case '/personal-data':
        this.navigateToPersonalData(newCode);
        break;
    }
  }

  goToNextRoom() {
    const num = this.extractRoomNumber();
    if (num >= 15) return;

    const newCode = this.formatRoomCode(num + 1);

    switch (this.router.url) {
      case '/care-data':
        this.activateRoom(newCode);
        break;
      case '/medical-data':
        this.navigateToMedicalData(newCode);
        break;
      case '/personal-data':
        this.navigateToPersonalData(newCode);
        break;
    }
  }
}
