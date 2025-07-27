import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="reports-container">
      <div class="reports-header">
        <h1>Rapports et Statistiques</h1>
        <p>Tableau de bord des rapports du système de suivi des interventions IT</p>
      </div>

      <mat-tab-group class="reports-tabs">
        
        <!-- Statistiques Générales -->
        <mat-tab label="Statistiques Générales">
          <div class="tab-content">
            <div class="stats-grid">
              
              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon color="primary">assignment</mat-icon>
                    Total Interventions
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-number">{{ totalInterventions }}</div>
                  <div class="stat-label">Interventions enregistrées</div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon color="accent">pending</mat-icon>
                    En Attente
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-number">{{ pendingInterventions }}</div>
                  <div class="stat-label">Interventions en attente</div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon color="primary">check_circle</mat-icon>
                    Terminées
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-number">{{ completedInterventions }}</div>
                  <div class="stat-label">Interventions terminées</div>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon color="primary">business</mat-icon>
                    Postes Comptables
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-number">{{ totalPosts }}</div>
                  <div class="stat-label">Postes enregistrés</div>
                </mat-card-content>
              </mat-card>

            </div>
          </div>
        </mat-tab>

        <!-- Rapports par Période -->
        <mat-tab label="Rapports par Période">
          <div class="tab-content">
            <div class="filter-section">
              <mat-form-field appearance="outline">
                <mat-label>Date de début</mat-label>
                <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate">
                <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date de fin</mat-label>
                <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate">
                <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>

              <button mat-raised-button color="primary" (click)="generatePeriodReport()">
                <mat-icon>search</mat-icon>
                Générer Rapport
              </button>
            </div>

            <mat-card *ngIf="periodReport.length > 0">
              <mat-card-header>
                <mat-card-title>Interventions par Période</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="periodReport" class="reports-table">
                  
                  <ng-container matColumnDef="title">
                    <th mat-header-cell *matHeaderCellDef>Titre</th>
                    <td mat-cell *matCellDef="let intervention">{{ intervention.title }}</td>
                  </ng-container>

                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let intervention">{{ intervention.type }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let intervention">
                      <span class="status-badge" [ngClass]="'status-' + intervention.status.toLowerCase()">
                        {{ getStatusLabel(intervention.status) }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="createdAt">
                    <th mat-header-cell *matHeaderCellDef>Date Création</th>
                    <td mat-cell *matCellDef="let intervention">{{ intervention.createdAt | date:'dd/MM/yyyy' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let intervention">
                      <button mat-icon-button color="primary" (click)="printIntervention(intervention)" 
                              matTooltip="Imprimer l'intervention">
                        <mat-icon>print</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Rapports par Région -->
        <mat-tab label="Rapports par Région">
          <div class="tab-content">
            <div class="filter-section">
              <mat-form-field appearance="outline">
                <mat-label>Sélectionner une région</mat-label>
                <mat-select [(ngModel)]="selectedRegion" (selectionChange)="generateRegionReport()">
                  <mat-option value="">Toutes les régions</mat-option>
                  <mat-option value="Centre">Centre</mat-option>
                  <mat-option value="Littoral">Littoral</mat-option>
                  <mat-option value="Ouest">Ouest</mat-option>
                  <mat-option value="Nord-Ouest">Nord-Ouest</mat-option>
                  <mat-option value="Sud-Ouest">Sud-Ouest</mat-option>
                  <mat-option value="Est">Est</mat-option>
                  <mat-option value="Nord">Nord</mat-option>
                  <mat-option value="Adamaoua">Adamaoua</mat-option>
                  <mat-option value="Extrême-Nord">Extrême-Nord</mat-option>
                  <mat-option value="Sud">Sud</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="region-stats" *ngIf="regionStats.length > 0">
              <mat-card *ngFor="let stat of regionStats" class="region-card">
                <mat-card-header>
                  <mat-card-title>{{ stat.region }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="region-stat">
                    <span class="stat-label">Postes Comptables:</span>
                    <span class="stat-value">{{ stat.postsCount }}</span>
                  </div>
                  <div class="region-stat">
                    <span class="stat-label">Interventions:</span>
                    <span class="stat-value">{{ stat.interventionsCount }}</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Actions Rapides -->
        <mat-tab label="Actions Rapides">
          <div class="tab-content">
            <div class="quick-actions-grid">
              
              <mat-card class="action-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>print</mat-icon>
                    Rapports d'Impression
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>Générer et imprimer des rapports détaillés</p>
                  <button mat-raised-button color="primary" (click)="printAllInterventions()">
                    <mat-icon>print</mat-icon>
                    Imprimer Toutes les Interventions
                  </button>
                </mat-card-content>
              </mat-card>

              <mat-card class="action-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>file_download</mat-icon>
                    Export de Données
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>Exporter les données au format Excel/PDF</p>
                  <button mat-raised-button color="accent" (click)="exportToExcel()">
                    <mat-icon>file_download</mat-icon>
                    Exporter vers Excel
                  </button>
                </mat-card-content>
              </mat-card>

              <mat-card class="action-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>assessment</mat-icon>
                    Analyse Avancée
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>Analyses et graphiques détaillés</p>
                  <button mat-raised-button color="primary" (click)="generateAdvancedAnalysis()">
                    <mat-icon>assessment</mat-icon>
                    Analyse Avancée
                  </button>
                </mat-card-content>
              </mat-card>

            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .reports-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .reports-header h1 {
      color: #1976d2;
      margin-bottom: 10px;
    }

    .reports-tabs {
      margin-top: 20px;
    }

    .tab-content {
      padding: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-card mat-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 16px;
    }

    .stat-number {
      font-size: 48px;
      font-weight: bold;
      color: #1976d2;
      margin: 10px 0;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .filter-section {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .reports-table {
      width: 100%;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-in_progress {
      background-color: #cce5ff;
      color: #004085;
    }

    .status-completed {
      background-color: #d4edda;
      color: #155724;
    }

    .region-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .region-card {
      min-height: 120px;
    }

    .region-stat {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }

    .stat-label {
      font-weight: 500;
    }

    .stat-value {
      font-weight: bold;
      color: #1976d2;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .action-card {
      text-align: center;
    }

    .action-card mat-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .action-card p {
      margin: 15px 0;
      color: #666;
    }

    .action-card button {
      margin-top: 10px;
    }
  `]
})
export class ReportsDashboardComponent implements OnInit {
  totalInterventions = 0;
  pendingInterventions = 0;
  completedInterventions = 0;
  totalPosts = 0;

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedRegion = '';

  periodReport: any[] = [];
  regionStats: any[] = [];

  displayedColumns = ['title', 'type', 'status', 'createdAt', 'actions'];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStatistics();
    this.loadRegionStats();
  }

  loadStatistics() {
    // Load interventions
    this.http.get<any[]>('http://localhost:9090/api/interventions').subscribe({
      next: (interventions) => {
        this.totalInterventions = interventions.length;
        this.pendingInterventions = interventions.filter(i => i.status === 'PENDING').length;
        this.completedInterventions = interventions.filter(i => i.status === 'COMPLETED').length;
      },
      error: (error) => console.error('Error loading interventions:', error)
    });

    // Load comptable posts
    this.http.get<any[]>('http://localhost:9090/api/comptable-posts').subscribe({
      next: (posts) => {
        this.totalPosts = posts.length;
      },
      error: (error) => console.error('Error loading posts:', error)
    });
  }

  loadRegionStats() {
    this.http.get<any[]>('http://localhost:9090/api/comptable-posts').subscribe({
      next: (posts) => {
        const regionMap = new Map();
        
        posts.forEach(post => {
          const region = post.region || 'Non spécifié';
          if (!regionMap.has(region)) {
            regionMap.set(region, { region, postsCount: 0, interventionsCount: 0 });
          }
          regionMap.get(region).postsCount++;
        });

        this.regionStats = Array.from(regionMap.values());
      },
      error: (error) => console.error('Error loading region stats:', error)
    });
  }

  generatePeriodReport() {
    let url = 'http://localhost:9090/api/interventions';
    
    this.http.get<any[]>(url).subscribe({
      next: (interventions) => {
        this.periodReport = interventions.filter(intervention => {
          const createdDate = new Date(intervention.createdAt);
          const start = this.startDate ? new Date(this.startDate) : new Date('1900-01-01');
          const end = this.endDate ? new Date(this.endDate) : new Date();
          
          return createdDate >= start && createdDate <= end;
        });
      },
      error: (error) => console.error('Error generating period report:', error)
    });
  }

  generateRegionReport() {
    this.loadRegionStats();
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé'
    };
    return statusLabels[status] || status;
  }

  printIntervention(intervention: any) {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #1976d2; text-align: center;">Fiche d'Intervention</h1>
        <hr>
        <h2>Détails de l'Intervention</h2>
        <p><strong>Titre:</strong> ${intervention.title}</p>
        <p><strong>Description:</strong> ${intervention.description}</p>
        <p><strong>Type:</strong> ${intervention.type}</p>
        <p><strong>Priorité:</strong> ${intervention.priority}</p>
        <p><strong>Statut:</strong> ${this.getStatusLabel(intervention.status)}</p>
        <p><strong>Date de création:</strong> ${new Date(intervention.createdAt).toLocaleDateString('fr-FR')}</p>
        <hr>
        <p style="text-align: center; color: #666; font-size: 12px;">
          Ministère des Finances du Cameroun - Système de Suivi des Interventions IT
        </p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  printAllInterventions() {
    this.http.get<any[]>('http://localhost:9090/api/interventions').subscribe({
      next: (interventions) => {
        const printContent = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="color: #1976d2; text-align: center;">Rapport Complet des Interventions</h1>
            <hr>
            <p><strong>Date du rapport:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            <p><strong>Nombre total d'interventions:</strong> ${interventions.length}</p>
            <hr>
            ${interventions.map(intervention => `
              <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px;">
                <h3>${intervention.title}</h3>
                <p><strong>Type:</strong> ${intervention.type}</p>
                <p><strong>Statut:</strong> ${this.getStatusLabel(intervention.status)}</p>
                <p><strong>Date:</strong> ${new Date(intervention.createdAt).toLocaleDateString('fr-FR')}</p>
                <p><strong>Description:</strong> ${intervention.description}</p>
              </div>
            `).join('')}
            <hr>
            <p style="text-align: center; color: #666; font-size: 12px;">
              Ministère des Finances du Cameroun - Système de Suivi des Interventions IT
            </p>
          </div>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.print();
        }
      },
      error: (error) => console.error('Error loading interventions for print:', error)
    });
  }

  exportToExcel() {
    console.log('Export to Excel functionality - to be implemented');
    // TODO: Implement Excel export functionality
  }

  generateAdvancedAnalysis() {
    console.log('Advanced analysis functionality - to be implemented');
    // TODO: Implement advanced analysis functionality
  }
}
