import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-intervention-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Modifier l'Intervention</h2>
    
    <mat-dialog-content>
      <form [formGroup]="editForm" class="edit-form">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title" placeholder="Titre de l'intervention">
          <mat-error *ngIf="editForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" 
                    placeholder="Description détaillée de l'intervention"></textarea>
          <mat-error *ngIf="editForm.get('description')?.hasError('required')">
            La description est requise
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Type d'intervention</mat-label>
            <mat-select formControlName="type">
              <mat-option value="SOFTWARE_INSTALLATION">Installation logiciel</mat-option>
              <mat-option value="HARDWARE_REPAIR">Réparation matériel</mat-option>
              <mat-option value="NETWORK_MAINTENANCE">Maintenance réseau</mat-option>
              <mat-option value="SYSTEM_UPDATE">Mise à jour système</mat-option>
              <mat-option value="USER_TRAINING">Formation utilisateur</mat-option>
              <mat-option value="TECHNICAL_SUPPORT">Support technique</mat-option>
              <mat-option value="DATA_BACKUP">Sauvegarde données</mat-option>
              <mat-option value="SECURITY_AUDIT">Audit sécurité</mat-option>
              <mat-option value="OTHER">Autre</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="LOW">Faible</mat-option>
              <mat-option value="MEDIUM">Moyenne</mat-option>
              <mat-option value="HIGH">Élevée</mat-option>
              <mat-option value="URGENT">Urgente</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="status">
              <mat-option value="PENDING">En attente</mat-option>
              <mat-option value="IN_PROGRESS">En cours</mat-option>
              <mat-option value="COMPLETED">Terminé</mat-option>
              <mat-option value="CANCELLED">Annulé</mat-option>
              <mat-option value="ON_HOLD">En pause</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Poste comptable</mat-label>
            <mat-select formControlName="comptablePostId">
              <mat-option *ngFor="let post of comptablePosts" [value]="post.id">
                {{ post.postname }} - {{ post.codePC }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Assigné à</mat-label>
          <mat-select formControlName="assignedToId">
            <mat-option value="">Non assigné</mat-option>
            <mat-option *ngFor="let user of itProfessionals" [value]="user.id">
              {{ user.firstName }} {{ user.lastName }} ({{ user.username }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Problème signalé</mat-label>
          <textarea matInput formControlName="problemDescription" rows="3" 
                    placeholder="Description du problème signalé"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Équipement affecté</mat-label>
            <input matInput formControlName="equipmentAffected" 
                   placeholder="Ex: PC-001, Serveur-Main">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Durée estimée (heures)</mat-label>
            <input matInput type="number" formControlName="estimatedDuration" 
                   min="0.5" max="100" step="0.5">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="3" 
                    placeholder="Notes additionnelles"></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="editForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Modification...' : 'Modifier' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .edit-form {
      min-width: 500px;
      max-width: 600px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class InterventionEditDialogComponent implements OnInit {
  editForm: FormGroup;
  comptablePosts: any[] = [];
  itProfessionals: any[] = [];
  isSubmitting = false;
  intervention: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InterventionEditDialogComponent>,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.intervention = data.intervention;
    
    this.editForm = this.fb.group({
      title: [this.intervention.title, Validators.required],
      description: [this.intervention.description, Validators.required],
      type: [this.intervention.type || 'OTHER'],
      priority: [this.intervention.priority, Validators.required],
      status: [this.intervention.status, Validators.required],
      comptablePostId: [this.intervention.comptablePostId],
      assignedToId: [this.intervention.assignedToId],
      problemDescription: [this.intervention.problemDescription || ''],
      equipmentAffected: [this.intervention.equipmentAffected || ''],
      estimatedDuration: [this.intervention.estimatedDuration || 2],
      notes: [this.intervention.notes || '']
    });
  }

  ngOnInit() {
    this.loadComptablePosts();
    this.loadItProfessionals();
  }

  loadComptablePosts() {
    this.http.get<any[]>('http://localhost:9090/api/comptable-posts').subscribe({
      next: (posts) => {
        this.comptablePosts = posts;
      },
      error: (error) => {
        console.error('Error loading comptable posts:', error);
      }
    });
  }

  loadItProfessionals() {
    this.http.get<any[]>('http://localhost:9090/api/users').subscribe({
      next: (users) => {
        this.itProfessionals = users.filter(user => 
          user.role === 'IT_PROFESSIONAL' || user.role === 'ADMIN'
        );
      },
      error: (error) => {
        console.error('Error loading IT professionals:', error);
      }
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.isSubmitting = true;
      
      const updatedIntervention = {
        ...this.intervention,
        ...this.editForm.value,
        updatedAt: new Date(),
        updatedById: this.authService.getUser()?.id
      };

      this.http.put(`http://localhost:9090/api/interventions/${this.intervention.id}`, updatedIntervention).subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error updating intervention:', error);
          this.snackBar.open('Erreur lors de la modification de l\'intervention', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
