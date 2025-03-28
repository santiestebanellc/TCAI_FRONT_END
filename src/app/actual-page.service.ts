import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActualPageService {
  constructor() {}
  activeComponent = signal<string>('');

  setActiveComponent(componentName: string) {
    this.activeComponent.set(componentName);
  }
}
