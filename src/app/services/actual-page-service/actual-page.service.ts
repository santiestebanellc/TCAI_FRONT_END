import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // 🟢 Importante para standalone projects
})
export class ActualPageService {
  private _activeTitle = signal<string[]>(['General']);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects);
      });
  }

  private updateTitle(url: string) {
    console.log('URL detectada:', url); // 🔍 Debug

    const titles: { [key: string]: string[] } = {
      '/rooms/general': ['General', 'Habitacions'],
      '/rooms/diets': ['Dietes', 'Habitacions'],
      '/alerts': ['Totes les', 'Alertes'],
      '/care-data': ['Cures', 'Habitació 001'],
      '/medical-data': ['Informació Médica', 'Habitació 001'],
      '/personal-data': ['Informació Personal', 'Habitació 001'],
    };

    const newTitle = titles[url] || ['General'];
    console.log('Nuevo título:', newTitle);
    this._activeTitle.set(newTitle); // ✅ Actualiza el signal
  }

  get activeTitle() {
    return this._activeTitle; // 📢 Devuelve el signal
  }
}
