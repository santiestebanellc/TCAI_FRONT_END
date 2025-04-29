import { Component, HostListener, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-patient-data-nav-icons",
  templateUrl: "./patient-data-nav-icons.component.html",
  styleUrls: ["./patient-data-nav-icons.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PatientDataNavIconsComponent implements OnInit {
  isMenuOpen = false

  // Main item shown at the top
  mainItem = {
    icon: 'assets/care-icon.svg',
    label: 'Care',
    link: '/care-data'
  };

  // Array de enlaces para los botones
  menuItems = [
    { icon: 'assets/personal-icon.svg', label: 'Personal', link: '/personal-data' },
    { icon: 'assets/medical-icon.svg', label: 'Medical', link: '/medical-data' },
  ];

  constructor() {}

  ngOnInit(): void {}

  // Alternar la apertura/cierre del menú
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  // Cerrar el menú cuando se hace clic fuera del componente
  // @HostListener("document:click", ["$event"])
  // onDocumentClick(event: MouseEvent): void {
  //   const target = event.target as HTMLElement
  //   const componentElement = document.querySelector("app-patient-data-nav-icons")

  //   if (componentElement && !componentElement.contains(target)) {
  //     this.isMenuOpen = false
  //   }
  // }

  // onButtonClick(index: number): void {
  //   console.log(`Button ${index + 1} clicked`)
  //   // Implementa aquí la acción que debe ocurrir al hacer clic en un botón
  //   // Por ejemplo, navegar a una sección específica
  // }
}
