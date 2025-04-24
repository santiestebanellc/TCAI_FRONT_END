import { Component, HostListener, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-patient-data-nav-icons",
  templateUrl: "./patient-data-nav-icons.component.html",
  styleUrls: ["./patient-data-nav-icons.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class PatientDataNavIconsComponent implements OnInit {
  isMenuOpen = false

  // Array de colores para los botones
  colors: string[] = ["bg-[#d3e9e6]", "bg-[#b5c99a]", "bg-[#f8dc81]"]

  constructor() {}

  ngOnInit(): void {}

  // Alternar la apertura/cierre del menú
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }

  // Cerrar el menú cuando se hace clic fuera del componente
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const componentElement = document.querySelector("app-patient-data-nav-icons")

    if (componentElement && !componentElement.contains(target)) {
      this.isMenuOpen = false
    }
  }

  onButtonClick(index: number): void {
    console.log(`Button ${index + 1} clicked`)
    // Implementa aquí la acción que debe ocurrir al hacer clic en un botón
    // Por ejemplo, navegar a una sección específica
  }
}
