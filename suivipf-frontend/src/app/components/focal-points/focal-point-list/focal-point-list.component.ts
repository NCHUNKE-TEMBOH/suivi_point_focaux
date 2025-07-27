import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';

interface FocalPoint {
  id: number;
  firstName: string;
  lastName: string;
  matricule: string;
  email: string;
  phoneNumber: string;
  position: string;
  status: string;
  assignedAt: Date;
  lastActiveAt?: Date;
  comptablePostId?: number;
  comptablePostName?: string;
  userId?: number;
  userName?: string;
  totalInterventions: number;
  pendingInterventions: number;
}

@Component({
  selector: 'app-focal-point-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="focal-point-list-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_pin</mat-icon>
            Gestion des Points Focaux
          </mat-card-title>
          <mat-card-subtitle>
            Points focaux assignés aux postes comptables - Ministère des Finances du Cameroun
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-actions>
          <button mat-raised-button color="primary"
                  *ngIf="canManageFocalPoints()"
                  (click)="addFocalPoint()">
            <mat-icon>add</mat-icon>
            Assigner Point Focal
          </button>
          <button mat-raised-button color="accent" (click)="refreshFocalPoints()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="content-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="focalPoints" class="focal-points-table">

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let fp">
                  <div class="focal-point-name">
                    <strong>{{ fp.firstName }} {{ fp.lastName }}</strong>
                    <div class="focal-point-matricule">{{ fp.matricule }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Contact Column -->
              <ng-container matColumnDef="contact">
                <th mat-header-cell *matHeaderCellDef>Contact</th>
                <td mat-cell *matCellDef="let fp">
                  <div class="contact-info">
                    <div>{{ fp.email }}</div>
                    <div class="phone">{{ fp.phoneNumber }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Position Column -->
              <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef>Poste</th>
                <td mat-cell *matCellDef="let fp">{{ fp.position }}</td>
              </ng-container>

              <!-- Comptable Post Column -->
              <ng-container matColumnDef="comptablePost">
                <th mat-header-cell *matHeaderCellDef>Poste Comptable</th>
                <td mat-cell *matCellDef="let fp">
                  {{ fp.comptablePostName || 'Non assigné' }}
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let fp">
                  <mat-chip [color]="getStatusColor(fp.status)">
                    {{ getStatusLabel(fp.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Interventions Column -->
              <ng-container matColumnDef="interventions">
                <th mat-header-cell *matHeaderCellDef>Interventions</th>
                <td mat-cell *matCellDef="let fp">
                  <div class="intervention-stats">
                    <span class="total">{{ fp.totalInterventions }} total</span>
                    <span class="pending" *ngIf="fp.pendingInterventions > 0">
                      ({{ fp.pendingInterventions }} en attente)
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Last Active Column -->
              <ng-container matColumnDef="lastActive">
                <th mat-header-cell *matHeaderCellDef>Dernière activité</th>
                <td mat-cell *matCellDef="let fp">
                  {{ fp.lastActiveAt | date:'dd/MM/yyyy' || 'Jamais' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let fp">
                  <button mat-icon-button color="primary" (click)="viewFocalPoint(fp)" matTooltip="Voir">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent"
                          *ngIf="canManageFocalPoints()"
                          (click)="editFocalPoint(fp)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn"
                          *ngIf="canManageFocalPoints()"
                          (click)="removeFocalPoint(fp)" matTooltip="Retirer">
                    <mat-icon>person_remove</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div *ngIf="focalPoints.length === 0" class="no-data">
            <mat-icon>person_pin</mat-icon>
            <h3>Aucun point focal assigné</h3>
            <p>Commencez par assigner des points focaux aux postes comptables.</p>
            <button mat-raised-button color="primary"
                    *ngIf="canManageFocalPoints()"
                    (click)="addFocalPoint()">
              <mat-icon>add</mat-icon>
              Assigner un point focal
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .focal-point-list-container {
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

    .focal-points-table {
      width: 100%;
    }

    .focal-point-name {
      line-height: 1.4;
    }

    .focal-point-matricule {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .contact-info {
      line-height: 1.4;
    }

    .phone {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .intervention-stats {
      font-size: 12px;
    }

    .pending {
      color: #f57c00;
      font-weight: 500;
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
export class FocalPointListComponent implements OnInit {
  focalPoints: FocalPoint[] = [];
  displayedColumns: string[] = ['name', 'contact', 'position', 'comptablePost', 'status', 'interventions', 'lastActive', 'actions'];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadFocalPoints();
  }

  loadFocalPoints() {
    // Mock data for now - replace with actual service call
    this.focalPoints = [
      {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        matricule: 'FP001',
        email: 'jean.dupont@minfi.gov.cm',
        phoneNumber: '+237 6XX XXX XXX',
        position: 'Responsable IT',
        status: 'ACTIVE',
        assignedAt: new Date('2024-01-01'),
        lastActiveAt: new Date('2024-01-15'),
        comptablePostId: 1,
        comptablePostName: 'Poste Comptable Général - PGT001',
        userId: 2,
        userName: 'jean.dupont',
        totalInterventions: 15,
        pendingInterventions: 3
      },
      {
        id: 2,
        firstName: 'Marie',
        lastName: 'Martin',
        matricule: 'FP002',
        email: 'marie.martin@minfi.gov.cm',
        phoneNumber: '+237 6XX XXX XXX',
        position: 'Technicienne Réseau',
        status: 'ACTIVE',
        assignedAt: new Date('2024-01-02'),
        lastActiveAt: new Date('2024-01-14'),
        comptablePostId: 2,
        comptablePostName: 'Poste Comptable Régional - PCR002',
        userId: 3,
        userName: 'marie.martin',
        totalInterventions: 8,
        pendingInterventions: 1
      },
      {
        id: 3,
        firstName: 'Paul',
        lastName: 'Nguyen',
        matricule: 'FP003',
        email: 'paul.nguyen@minfi.gov.cm',
        phoneNumber: '+237 6XX XXX XXX',
        position: 'Support Technique',
        status: 'ON_LEAVE',
        assignedAt: new Date('2024-01-03'),
        lastActiveAt: new Date('2024-01-10'),
        totalInterventions: 5,
        pendingInterventions: 0
      }
    ];
  }

  addFocalPoint() {
    console.log('Add new focal point');
    // Navigate to assign focal point form or open dialog
  }

  viewFocalPoint(focalPoint: FocalPoint) {
    console.log('View focal point:', focalPoint);
    // Navigate to detail view
  }

  editFocalPoint(focalPoint: FocalPoint) {
    console.log('Edit focal point:', focalPoint);
    // Navigate to edit form or open dialog
  }

  removeFocalPoint(focalPoint: FocalPoint) {
    if (confirm(`Êtes-vous sûr de vouloir retirer ${focalPoint.firstName} ${focalPoint.lastName} de son poste de point focal?`)) {
      console.log('Remove focal point:', focalPoint);
      this.loadFocalPoints(); // Reload the list
    }
  }

  refreshFocalPoints() {
    this.loadFocalPoints();
  }

  canManageFocalPoints(): boolean {
    return this.authService.canManageFocalPoints();
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'SUSPENDED': 'Suspendu',
      'ON_LEAVE': 'En congé'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ACTIVE': 'primary',
      'INACTIVE': 'basic',
      'SUSPENDED': 'warn',
      'ON_LEAVE': 'accent'
    };
    return colors[status] || 'basic';
  }
}
