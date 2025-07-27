import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { InterventionCreateDialogComponent } from '../intervention-create-dialog/intervention-create-dialog.component';
import { InterventionDetailDialogComponent } from '../intervention-detail-dialog/intervention-detail-dialog.component';
import { InterventionEditDialogComponent } from '../intervention-edit-dialog/intervention-edit-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

interface Intervention {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  comptablePostId?: number;
  comptablePostName?: string;
  assignedToId?: number;
  assignedToName?: string;
  createdById: number;
  createdByName: string;
}

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="intervention-list-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>build</mat-icon>
            Gestion des Interventions IT
          </mat-card-title>
          <mat-card-subtitle>
            Suivi des interventions techniques - Ministère des Finances du Cameroun
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-actions>
          <button mat-raised-button color="primary"
                  *ngIf="canCreateInterventions()"
                  (click)="createIntervention()">
            <mat-icon>add</mat-icon>
            Nouvelle Intervention
          </button>
          <button mat-raised-button color="accent" (click)="loadInterventions()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
          <button mat-raised-button
                  *ngIf="canValidateInterventions()"
                  (click)="showPendingInterventions()">
            <mat-icon>pending_actions</mat-icon>
            Interventions en attente
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-card class="content-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="interventions" class="interventions-table">

              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Titre</th>
                <td mat-cell *matCellDef="let intervention">
                  <div class="intervention-title">
                    <strong>{{ intervention.title }}</strong>
                    <div class="intervention-description">{{ intervention.description | slice:0:100 }}...</div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let intervention">
                  <mat-chip [color]="getStatusColor(intervention.status)">
                    {{ getStatusLabel(intervention.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Priority Column -->
              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priorité</th>
                <td mat-cell *matCellDef="let intervention">
                  <mat-chip [color]="getPriorityColor(intervention.priority)">
                    {{ getPriorityLabel(intervention.priority) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Comptable Post Column -->
              <ng-container matColumnDef="comptablePost">
                <th mat-header-cell *matHeaderCellDef>Poste Comptable</th>
                <td mat-cell *matCellDef="let intervention">
                  {{ intervention.comptablePostName || 'Non assigné' }}
                </td>
              </ng-container>

              <!-- Assigned To Column -->
              <ng-container matColumnDef="assignedTo">
                <th mat-header-cell *matHeaderCellDef>Assigné à</th>
                <td mat-cell *matCellDef="let intervention">
                  {{ intervention.assignedToName || 'Non assigné' }}
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Date de création</th>
                <td mat-cell *matCellDef="let intervention">
                  {{ intervention.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let intervention">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="viewIntervention(intervention)">
                      <mat-icon>visibility</mat-icon>
                      <span>Voir</span>
                    </button>
                    <button mat-menu-item (click)="printIntervention(intervention)">
                      <mat-icon>print</mat-icon>
                      <span>Imprimer</span>
                    </button>
                    <button mat-menu-item
                            *ngIf="canEditIntervention(intervention)"
                            (click)="editIntervention(intervention)">
                      <mat-icon>edit</mat-icon>
                      <span>Modifier</span>
                    </button>
                    <button mat-menu-item
                            *ngIf="canValidateInterventions() && intervention.status === 'PENDING'"
                            (click)="validateIntervention(intervention)">
                      <mat-icon>check_circle</mat-icon>
                      <span>Valider</span>
                    </button>
                    <button mat-menu-item
                            *ngIf="canDeleteIntervention(intervention)"
                            (click)="deleteIntervention(intervention)">
                      <mat-icon color="warn">delete</mat-icon>
                      <span>Supprimer</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div *ngIf="interventions.length === 0" class="no-data">
            <mat-icon>build</mat-icon>
            <h3>Aucune intervention</h3>
            <p>Commencez par créer votre première intervention.</p>
            <button mat-raised-button color="primary"
                    *ngIf="canCreateInterventions()"
                    (click)="createIntervention()">
              <mat-icon>add</mat-icon>
              Créer une intervention
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .intervention-list-container {
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

    .interventions-table {
      width: 100%;
    }

    .intervention-title {
      line-height: 1.4;
    }

    .intervention-description {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
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
export class InterventionListComponent implements OnInit {
  interventions: Intervention[] = [];
  displayedColumns: string[] = ['title', 'status', 'priority', 'comptablePost', 'assignedTo', 'createdAt', 'actions'];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadInterventions();
  }

  loadInterventions() {
    this.http.get<any[]>('http://localhost:9090/api/interventions').subscribe({
      next: (interventions) => {
        this.interventions = interventions;
      },
      error: (error) => {
        console.error('Error loading interventions:', error);
        // Fallback to sample data if API fails
        this.interventions = [
          {
            id: 1,
            title: 'Installation logiciel comptable',
            description: 'Installation et configuration du logiciel comptable sur les postes de travail du service comptabilité',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            comptablePostId: 1,
            comptablePostName: 'Poste Comptable Général - PGT001',
            assignedToId: 2,
            assignedToName: 'Jean Dupont',
            createdById: 1,
            createdByName: 'Admin Système'
          },
          {
            id: 2,
            title: 'Maintenance réseau',
            description: 'Maintenance préventive du réseau informatique et vérification des connexions',
            status: 'PENDING',
            priority: 'MEDIUM',
            createdAt: new Date('2024-01-14'),
            updatedAt: new Date('2024-01-14'),
            comptablePostId: 2,
            comptablePostName: 'Poste Comptable Régional - PCR002',
            assignedToId: 3,
            assignedToName: 'Marie Martin',
            createdById: 2,
            createdByName: 'Gestionnaire Service'
          },
          {
            id: 3,
            title: 'Formation utilisateurs',
            description: 'Formation des utilisateurs sur le nouveau système comptable',
            status: 'COMPLETED',
            priority: 'LOW',
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-12'),
            comptablePostId: 1,
            comptablePostName: 'Poste Comptable Général - PGT001',
            assignedToId: 2,
            assignedToName: 'Jean Dupont',
            createdById: 1,
            createdByName: 'Admin Système'
          }
        ];
      }
    });
  }

  createIntervention() {
    const dialogRef = this.dialog.open(InterventionCreateDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInterventions(); // Refresh the list
      }
    });
  }

  viewIntervention(intervention: Intervention) {
    const dialogRef = this.dialog.open(InterventionDetailDialogComponent, {
      width: '800px',
      data: { intervention }
    });
  }

  editIntervention(intervention: Intervention) {
    const dialogRef = this.dialog.open(InterventionEditDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { intervention }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInterventions(); // Refresh the list
        this.snackBar.open('Intervention modifiée avec succès!', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  deleteIntervention(intervention: Intervention) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer l'intervention "${intervention.title}"?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:9090/api/interventions/${intervention.id}`).subscribe({
          next: () => {
            this.loadInterventions(); // Reload the list
            this.snackBar.open('Intervention supprimée avec succès!', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting intervention:', error);
            this.snackBar.open('Erreur lors de la suppression de l\'intervention', 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  validateIntervention(intervention: Intervention) {
    const updatedIntervention = {
      ...intervention,
      status: 'IN_PROGRESS',
      validatedAt: new Date(),
      validatedById: this.authService.getUser()?.id
    };

    this.http.put(`http://localhost:9090/api/interventions/${intervention.id}`, updatedIntervention).subscribe({
      next: () => {
        this.loadInterventions(); // Reload the list
        this.snackBar.open('Intervention validée avec succès!', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error validating intervention:', error);
        this.snackBar.open('Erreur lors de la validation de l\'intervention', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  showPendingInterventions() {
    this.interventions = this.interventions.filter(i => i.status === 'PENDING');
  }

  canCreateInterventions(): boolean {
    return this.authService.canCreateInterventions();
  }

  canValidateInterventions(): boolean {
    return this.authService.canValidateInterventions();
  }

  canEditIntervention(intervention: Intervention): boolean {
    return this.authService.isAdmin() ||
           this.authService.canManageInterventions() ||
           intervention.createdById === this.authService.getUser()?.id;
  }

  canDeleteIntervention(intervention: Intervention): boolean {
    return this.authService.isAdmin() ||
           intervention.createdById === this.authService.getUser()?.id;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé',
      'ON_HOLD': 'En pause'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'accent',
      'IN_PROGRESS': 'primary',
      'COMPLETED': 'primary',
      'CANCELLED': 'warn',
      'ON_HOLD': 'basic'
    };
    return colors[status] || 'basic';
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'LOW': 'Faible',
      'MEDIUM': 'Moyenne',
      'HIGH': 'Élevée',
      'URGENT': 'Urgente'
    };
    return labels[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'LOW': 'basic',
      'MEDIUM': 'accent',
      'HIGH': 'primary',
      'URGENT': 'warn'
    };
    return colors[priority] || 'basic';
  }

  printIntervention(intervention: any) {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1976d2; margin-bottom: 10px;">MINISTÈRE DES FINANCES DU CAMEROUN</h1>
          <h2 style="color: #333; margin-bottom: 20px;">FICHE D'INTERVENTION IT</h2>
          <hr style="border: 2px solid #1976d2;">
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px;">INFORMATIONS GÉNÉRALES</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold; width: 30%;">Titre:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Type d'intervention:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Priorité:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.getPriorityLabel(intervention.priority)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Statut:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.getStatusLabel(intervention.status)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Date de création:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date(intervention.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Poste comptable:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.comptablePostName || 'Non assigné'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Assigné à:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.assignedToName || 'Non assigné'}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px;">DESCRIPTION DÉTAILLÉE</h3>
          <div style="padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9; margin-top: 15px;">
            ${intervention.description || 'Aucune description fournie'}
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px;">INFORMATIONS TECHNIQUES</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold; width: 30%;">Problème signalé:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.problemDescription || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Équipement affecté:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.equipmentAffected || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Durée estimée:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${intervention.estimatedDuration || 'Non spécifié'} heures</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 50px;">
          <h3 style="color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px;">SIGNATURES</h3>
          <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div style="text-align: center; width: 45%;">
              <div style="border-bottom: 1px solid #000; height: 60px; margin-bottom: 10px;"></div>
              <p style="font-weight: bold;">Demandeur</p>
              <p style="font-size: 12px;">Nom et signature</p>
            </div>
            <div style="text-align: center; width: 45%;">
              <div style="border-bottom: 1px solid #000; height: 60px; margin-bottom: 10px;"></div>
              <p style="font-weight: bold;">Technicien IT</p>
              <p style="font-size: 12px;">Nom et signature</p>
            </div>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
          <p style="color: #666; font-size: 12px;">
            Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}<br>
            Système de Suivi des Interventions IT - Ministère des Finances du Cameroun
          </p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fiche d'Intervention - ${intervention.title}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 1cm; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
