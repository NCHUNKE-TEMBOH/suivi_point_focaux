import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface InterventionSheet {
  id: number;
  sheetTitle: string;
  content: string;
  summary: string;
  sheetType: string;
  status: string;
  createdBy: string;
  createdAt: Date;
  interventionId?: number;
  interventionTitle?: string;
}

@Component({
  selector: 'app-intervention-sheet-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="intervention-sheets-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>description</mat-icon>
            Fiches d'Intervention
          </mat-card-title>
          <mat-card-subtitle>
            Gestion des fiches d'intervention - Ministère des Finances du Cameroun
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" 
                  *ngIf="canCreateSheets()"
                  (click)="createSheet()">
            <mat-icon>add</mat-icon>
            Nouvelle Fiche
          </button>
          <button mat-raised-button color="accent" (click)="refreshSheets()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="content-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="sheets" class="intervention-sheets-table">
              
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Titre</th>
                <td mat-cell *matCellDef="let sheet">
                  <div class="sheet-title">
                    <strong>{{ sheet.sheetTitle }}</strong>
                    <div class="sheet-summary">{{ sheet.summary }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Type Column -->
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let sheet">
                  <mat-chip [color]="getTypeColor(sheet.sheetType)">
                    {{ getTypeLabel(sheet.sheetType) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let sheet">
                  <mat-chip [color]="getStatusColor(sheet.status)">
                    {{ getStatusLabel(sheet.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Intervention Column -->
              <ng-container matColumnDef="intervention">
                <th mat-header-cell *matHeaderCellDef>Intervention</th>
                <td mat-cell *matCellDef="let sheet">
                  <div *ngIf="sheet.interventionTitle" class="intervention-link">
                    <mat-icon>build</mat-icon>
                    {{ sheet.interventionTitle }}
                  </div>
                  <span *ngIf="!sheet.interventionTitle" class="no-intervention">
                    Aucune intervention liée
                  </span>
                </td>
              </ng-container>

              <!-- Created By Column -->
              <ng-container matColumnDef="createdBy">
                <th mat-header-cell *matHeaderCellDef>Créé par</th>
                <td mat-cell *matCellDef="let sheet">{{ sheet.createdBy }}</td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Date de création</th>
                <td mat-cell *matCellDef="let sheet">
                  {{ sheet.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let sheet">
                  <button mat-icon-button color="primary" 
                          (click)="viewSheet(sheet)"
                          matTooltip="Voir la fiche">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" 
                          *ngIf="canEditSheet(sheet)"
                          (click)="editSheet(sheet)"
                          matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" 
                          *ngIf="canDeleteSheet(sheet)"
                          (click)="deleteSheet(sheet)"
                          matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div *ngIf="sheets.length === 0" class="no-data">
            <mat-icon>description</mat-icon>
            <h3>Aucune fiche d'intervention</h3>
            <p>Commencez par créer votre première fiche d'intervention.</p>
            <button mat-raised-button color="primary" 
                    *ngIf="canCreateSheets()"
                    (click)="createSheet()">
              <mat-icon>add</mat-icon>
              Créer une fiche
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .intervention-sheets-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-card {
      margin-bottom: 20px;
    }

    .header-card mat-card-header {
      margin-bottom: 16px;
    }

    .header-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1e3a8a;
    }

    .content-card {
      min-height: 400px;
    }

    .table-container {
      overflow-x: auto;
    }

    .intervention-sheets-table {
      width: 100%;
    }

    .sheet-title {
      line-height: 1.4;
    }

    .sheet-summary {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .intervention-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }

    .no-intervention {
      color: #999;
      font-style: italic;
      font-size: 12px;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .no-data h3 {
      margin: 16px 0 8px 0;
      color: #333;
    }

    .no-data p {
      margin-bottom: 24px;
    }

    mat-chip {
      font-size: 11px;
    }
  `]
})
export class InterventionSheetListComponent implements OnInit {
  sheets: InterventionSheet[] = [];
  displayedColumns: string[] = ['title', 'type', 'status', 'intervention', 'createdBy', 'createdAt', 'actions'];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadSheets();
  }

  loadSheets() {
    // Mock data for now - replace with actual service call
    this.sheets = [
      {
        id: 1,
        sheetTitle: 'Rapport d\'installation logiciel comptable',
        content: 'Installation et configuration du logiciel comptable...',
        summary: 'Installation réussie du logiciel comptable sur 5 postes',
        sheetType: 'INTERVENTION_REPORT',
        status: 'APPROVED',
        createdBy: 'Point Focal',
        createdAt: new Date('2024-01-15'),
        interventionId: 1,
        interventionTitle: 'Installation logiciel comptable - PGT001'
      },
      {
        id: 2,
        sheetTitle: 'Documentation technique réseau',
        content: 'Configuration du réseau local...',
        summary: 'Documentation de la configuration réseau',
        sheetType: 'TECHNICAL_DOCUMENTATION',
        status: 'PENDING_APPROVAL',
        createdBy: 'Point Focal',
        createdAt: new Date('2024-01-14')
      }
    ];
  }

  refreshSheets() {
    this.loadSheets();
  }

  createSheet() {
    console.log('Create new intervention sheet');
    // Navigate to create form
  }

  viewSheet(sheet: InterventionSheet) {
    console.log('View sheet:', sheet);
    // Navigate to detail view
  }

  editSheet(sheet: InterventionSheet) {
    console.log('Edit sheet:', sheet);
    // Navigate to edit form
  }

  deleteSheet(sheet: InterventionSheet) {
    console.log('Delete sheet:', sheet);
    // Show confirmation dialog and delete
  }

  canCreateSheets(): boolean {
    return this.authService.canCreateInterventionSheets();
  }

  canEditSheet(sheet: InterventionSheet): boolean {
    return this.authService.canCreateInterventionSheets();
  }

  canDeleteSheet(sheet: InterventionSheet): boolean {
    return this.authService.isAdmin() || this.authService.isFocalPoint();
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'INTERVENTION_REPORT': 'Rapport d\'intervention',
      'TECHNICAL_DOCUMENTATION': 'Documentation technique',
      'USER_MANUAL': 'Manuel utilisateur',
      'INCIDENT_REPORT': 'Rapport d\'incident',
      'MAINTENANCE_LOG': 'Journal de maintenance',
      'TRAINING_MATERIAL': 'Matériel de formation'
    };
    return labels[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'INTERVENTION_REPORT': 'primary',
      'TECHNICAL_DOCUMENTATION': 'accent',
      'USER_MANUAL': 'primary',
      'INCIDENT_REPORT': 'warn',
      'MAINTENANCE_LOG': 'primary',
      'TRAINING_MATERIAL': 'accent'
    };
    return colors[type] || 'basic';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'DRAFT': 'Brouillon',
      'PENDING_APPROVAL': 'En attente d\'approbation',
      'APPROVED': 'Approuvé',
      'REJECTED': 'Rejeté',
      'ARCHIVED': 'Archivé'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'DRAFT': 'basic',
      'PENDING_APPROVAL': 'accent',
      'APPROVED': 'primary',
      'REJECTED': 'warn',
      'ARCHIVED': 'basic'
    };
    return colors[status] || 'basic';
  }
}
