import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-intervention-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="intervention-detail-dialog">
      <div mat-dialog-title class="dialog-header">
        <mat-icon>visibility</mat-icon>
        <span>Détails de l'Intervention</span>
      </div>

      <mat-dialog-content class="dialog-content">
        <div class="intervention-details">
          
          <!-- Basic Information -->
          <mat-card class="info-section">
            <mat-card-header>
              <mat-card-title>Informations Générales</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Titre:</span>
                <span class="value">{{ intervention.title }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">{{ intervention.description }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Type:</span>
                <span class="value">{{ intervention.type || 'Non spécifié' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Statut:</span>
                <mat-chip [color]="getStatusColor(intervention.status)">
                  {{ getStatusLabel(intervention.status) }}
                </mat-chip>
              </div>
              <div class="detail-row">
                <span class="label">Priorité:</span>
                <mat-chip [color]="getPriorityColor(intervention.priority)">
                  {{ getPriorityLabel(intervention.priority) }}
                </mat-chip>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Assignment Information -->
          <mat-card class="info-section">
            <mat-card-header>
              <mat-card-title>Affectation</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Poste Comptable:</span>
                <span class="value">{{ intervention.comptablePostName || 'Non assigné' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Assigné à:</span>
                <span class="value">{{ intervention.assignedToName || 'Non assigné' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Créé par:</span>
                <span class="value">{{ intervention.createdByName || 'Inconnu' }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Dates Information -->
          <mat-card class="info-section">
            <mat-card-header>
              <mat-card-title>Dates</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Date de création:</span>
                <span class="value">{{ intervention.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Dernière modification:</span>
                <span class="value">{{ intervention.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="detail-row" *ngIf="intervention.validatedAt">
                <span class="label">Date de validation:</span>
                <span class="value">{{ intervention.validatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="detail-row" *ngIf="intervention.completedAt">
                <span class="label">Date de completion:</span>
                <span class="value">{{ intervention.completedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Technical Information -->
          <mat-card class="info-section" *ngIf="intervention.problemDescription || intervention.equipmentAffected">
            <mat-card-header>
              <mat-card-title>Informations Techniques</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row" *ngIf="intervention.problemDescription">
                <span class="label">Problème signalé:</span>
                <span class="value">{{ intervention.problemDescription }}</span>
              </div>
              <div class="detail-row" *ngIf="intervention.equipmentAffected">
                <span class="label">Équipement affecté:</span>
                <span class="value">{{ intervention.equipmentAffected }}</span>
              </div>
              <div class="detail-row" *ngIf="intervention.estimatedDuration">
                <span class="label">Durée estimée:</span>
                <span class="value">{{ intervention.estimatedDuration }} heures</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Notes and Comments -->
          <mat-card class="info-section" *ngIf="intervention.notes || intervention.comments">
            <mat-card-header>
              <mat-card-title>Notes et Commentaires</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row" *ngIf="intervention.notes">
                <span class="label">Notes:</span>
                <span class="value">{{ intervention.notes }}</span>
              </div>
              <div class="detail-row" *ngIf="intervention.comments">
                <span class="label">Commentaires:</span>
                <span class="value">{{ intervention.comments }}</span>
              </div>
            </mat-card-content>
          </mat-card>

        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Fermer</button>
        <button mat-raised-button color="primary" (click)="onPrint()">
          <mat-icon>print</mat-icon>
          Imprimer
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .intervention-detail-dialog {
      min-width: 600px;
      max-width: 800px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
      margin-bottom: 20px;
    }

    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    .intervention-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-section {
      margin-bottom: 16px;
    }

    .info-section mat-card-title {
      color: #1976d2;
      font-size: 16px;
      font-weight: 500;
    }

    .detail-row {
      display: flex;
      margin-bottom: 12px;
      align-items: flex-start;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 180px;
      margin-right: 16px;
    }

    .value {
      flex: 1;
      color: #333;
      word-break: break-word;
    }

    mat-chip {
      font-size: 12px;
      height: 24px;
    }

    mat-dialog-actions {
      padding: 16px 0;
      margin-top: 20px;
    }

    mat-dialog-actions button {
      margin-left: 8px;
    }
  `]
})
export class InterventionDetailDialogComponent {
  intervention: any;

  constructor(
    private dialogRef: MatDialogRef<InterventionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.intervention = data.intervention;
  }

  onClose() {
    this.dialogRef.close();
  }

  onPrint() {
    this.printIntervention();
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

  printIntervention() {
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
              <td style="padding: 8px; border: 1px solid #ddd;">${this.intervention.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Type d'intervention:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.intervention.type || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Priorité:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.getPriorityLabel(this.intervention.priority)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Statut:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.getStatusLabel(this.intervention.status)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Date de création:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date(this.intervention.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Poste comptable:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.intervention.comptablePostName || 'Non assigné'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;">Assigné à:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.intervention.assignedToName || 'Non assigné'}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px;">DESCRIPTION DÉTAILLÉE</h3>
          <div style="padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9; margin-top: 15px;">
            ${this.intervention.description || 'Aucune description fournie'}
          </div>
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
            <title>Fiche d'Intervention - ${this.intervention.title}</title>
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
