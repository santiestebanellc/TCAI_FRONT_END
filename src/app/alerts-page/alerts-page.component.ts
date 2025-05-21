import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Alert {
  id: string;
  type: 'diet' | 'medication' | 'allergy' | 'vital';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  room: string;
  floor: string;
  patientId: string;
  patientName: string;
  message: string;
  timestamp: Date;
  tags?: string[];
  notes?: {
    author: string;
    content: string;
    timestamp: Date;
  }[];
}

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts-page.component.html',
  styleUrl: './alerts-page.component.css',
})
export class AlertsPageComponent implements OnInit {
  // Data
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  selectedAlert: Alert | null = null;
  
  // Stats
  totalAlerts = 0;
  urgentAlerts = 0;
  pendingAlerts = 0;
  
  // UI States
  isLoading = true;
  showUserMenu = false;
  showAdvancedFilters = false;
  
  // Filters
  currentFilter = 'all';
  searchTerm = '';
  filterType = 'all';
  filterFloor = 'all';
  startDate: string | null = null;
  endDate: string | null = null;
  
  // Pagination
  itemsPerPage = 12;
  currentPage = 1;
  totalPages = 1;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadAlerts();
  }
  
  loadAlerts(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      this.alerts = [
        {
          id: '1',
          type: 'diet',
          priority: 'high',
          status: 'pending',
          room: '101',
          floor: '1',
          patientId: 'P001',
          patientName: 'Juan Pérez',
          message: 'Paciente con restricción de dieta no recibió comida adecuada',
          timestamp: new Date(),
          tags: ['Dieta', 'Urgente'],
          notes: [
            {
              author: 'Dr. García',
              content: 'Paciente con diabetes tipo 2, necesita dieta baja en carbohidratos',
              timestamp: new Date(Date.now() - 3600000)
            }
          ]
        },
        {
          id: '2',
          type: 'medication',
          priority: 'medium',
          status: 'in-progress',
          room: '203',
          floor: '2',
          patientId: 'P002',
          patientName: 'María González',
          message: 'Medicación para el dolor pendiente de administrar',
          timestamp: new Date(Date.now() - 1800000),
          tags: ['Medicación', 'Dolor']
        },
        {
          id: '3',
          type: 'allergy',
          priority: 'high',
          status: 'pending',
          room: '105',
          floor: '1',
          patientId: 'P003',
          patientName: 'Carlos Rodríguez',
          message: 'Reacción alérgica detectada, requiere atención inmediata',
          timestamp: new Date(Date.now() - 900000),
          tags: ['Alergia', 'Urgente']
        },
        {
          id: '4',
          type: 'vital',
          priority: 'medium',
          status: 'pending',
          room: '302',
          floor: '3',
          patientId: 'P004',
          patientName: 'Ana Martínez',
          message: 'Presión arterial elevada, monitorizar cada 30 minutos',
          timestamp: new Date(Date.now() - 7200000),
          tags: ['Signos vitales', 'Presión arterial']
        },
        {
          id: '5',
          type: 'diet',
          priority: 'low',
          status: 'resolved',
          room: '201',
          floor: '2',
          patientId: 'P005',
          patientName: 'Roberto Sánchez',
          message: 'Solicitud de cambio de dieta a vegetariana',
          timestamp: new Date(Date.now() - 86400000),
          tags: ['Dieta', 'Vegetariana']
        },
        {
          id: '6',
          type: 'medication',
          priority: 'high',
          status: 'in-progress',
          room: '104',
          floor: '1',
          patientId: 'P006',
          patientName: 'Laura Fernández',
          message: 'Antibiótico IV debe ser administrado en los próximos 15 minutos',
          timestamp: new Date(Date.now() - 600000),
          tags: ['Medicación', 'Antibiótico', 'Urgente']
        },
        {
          id: '7',
          type: 'vital',
          priority: 'low',
          status: 'pending',
          room: '305',
          floor: '3',
          patientId: 'P007',
          patientName: 'Miguel Torres',
          message: 'Temperatura ligeramente elevada, monitorizar',
          timestamp: new Date(Date.now() - 10800000),
          tags: ['Signos vitales', 'Temperatura']
        },
        {
          id: '8',
          type: 'allergy',
          priority: 'medium',
          status: 'resolved',
          room: '202',
          floor: '2',
          patientId: 'P008',
          patientName: 'Sofía López',
          message: 'Alergia a medicamento documentada en historial',
          timestamp: new Date(Date.now() - 172800000),
          tags: ['Alergia', 'Medicación']
        }
      ];
      
      // Calculate stats
      this.totalAlerts = this.alerts.length;
      this.urgentAlerts = this.alerts.filter(a => a.priority === 'high').length;
      this.pendingAlerts = this.alerts.filter(a => a.status === 'pending').length;
      
      // Apply initial filters
      this.applyFilters();
      
      this.isLoading = false;
    }, 1500);
  }
  
  refreshData(): void {
    this.loadAlerts();
  }
  
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }
  
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }
  
  toggleMobileFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }
  
  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.applyFilters();
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  applyFilters(): void {
    let filtered = [...this.alerts];
    
    // Apply main filter
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'urgent') {
        filtered = filtered.filter(a => a.priority === 'high');
      } else if (this.currentFilter === 'pending') {
        filtered = filtered.filter(a => a.status === 'pending');
      } else if (this.currentFilter === 'resolved') {
        filtered = filtered.filter(a => a.status === 'resolved');
      }
    }
    
    // Apply type filter
    if (this.filterType !== 'all') {
      filtered = filtered.filter(a => a.type === this.filterType);
    }
    
    // Apply floor filter
    if (this.filterFloor !== 'all') {
      filtered = filtered.filter(a => a.floor === this.filterFloor);
    }
    
    // Apply date filters
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(a => a.timestamp >= start);
    }
    
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(a => a.timestamp <= end);
    }
    
    // Apply search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.patientName.toLowerCase().includes(term) ||
        a.room.toLowerCase().includes(term) ||
        a.message.toLowerCase().includes(term) ||
        (a.tags && a.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    this.filteredAlerts = filtered;
    this.calculatePagination();
  }
  
  resetFilters(): void {
    this.currentFilter = 'all';
    this.searchTerm = '';
    this.filterType = 'all';
    this.filterFloor = 'all';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }
  
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAlerts.length / this.itemsPerPage);
    this.currentPage = 1;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  getVisiblePageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
  
  viewAlert(alertId: string): void {
    this.selectedAlert = this.alerts.find(a => a.id === alertId) || null;
  }
  
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      this.applyFilters();
    }
  }
  
  resolveAlertFromModal(alertId: string): void {
    this.resolveAlert(alertId);
    this.closeModal();
  }
  
  assignAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'in-progress';
      this.applyFilters();
    }
  }
  
  closeModal(): void {
    this.selectedAlert = null;
  }
  
  getIconForType(type: string): string {
    switch (type) {
      case 'diet': return 'fa-utensils';
      case 'medication': return 'fa-pills';
      case 'allergy': return 'fa-exclamation-circle';
      case 'vital': return 'fa-heartbeat';
      default: return 'fa-bell';
    }
  }
  
  getTypeLabel(type: string): string {
    switch (type) {
      case 'diet': return 'Dieta';
      case 'medication': return 'Medicación';
      case 'allergy': return 'Alergia';
      case 'vital': return 'Signos vitales';
      default: return 'Alerta';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En proceso';
      case 'resolved': return 'Resuelta';
      default: return status;
    }
  }
  
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  }

  getPatientCardClass(room: string): string {
    // Asigna una clase de color basada en el número de habitación
    const roomNumber = parseInt(room, 10);
    const colorIndex = roomNumber % 6; // 6 colores diferentes
    
    switch(colorIndex) {
      case 0: return 'patient-blue';
      case 1: return 'patient-green';
      case 2: return 'patient-purple';
      case 3: return 'patient-pink';
      case 4: return 'patient-yellow';
      case 5: return 'patient-teal';
      default: return 'patient-blue';
    }
  }
}