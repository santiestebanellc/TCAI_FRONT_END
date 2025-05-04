import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActualRoomService } from '../actual-room/actual-room.service';

@Injectable({
  providedIn: 'root', // 🟢 Importante para standalone projects
})
export class ActualPageService {
  private _activeTitle = signal<string[]>(['General']);
  private actualRoom = '';
  constructor(
    private router: Router,
    private actualRoomService: ActualRoomService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects);
      });
  }

  private updateTitle(url: string) {
    console.log('URL detectada:', url); // 🔍 Debug

    this.actualRoomService.getActualRoom().subscribe((room) => {
      this.actualRoom = room || '';
    });

    const titles: { [key: string]: string[] } = {
      '/rooms/general': ['General', 'Habitacions'],
      '/rooms/diets': ['Dietes', 'Habitacions'],
      '/alerts': ['Totes les', 'Alertes'],
      '/care-data': ['Cures', this.actualRoom || ''],
      '/medical-data': ['Informació Médica', this.actualRoom || ''],
      '/personal-data': ['Informació Personal', this.actualRoom || ''],
    };

    const newTitle = titles[url] || ['General'];
    console.log('Nuevo título:', newTitle);
    this._activeTitle.set(newTitle); // ✅ Actualiza el signal
  }

  get activeTitle() {
    return this._activeTitle; // 📢 Devuelve el signal
  }
}
