import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-intervention-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Nouvelle Intervention</h2>
    
    <mat-dialog-content>
      <form [formGroup]="interventionForm" class="intervention-form">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre de l'intervention</mat-label>
          <input matInput formControlName="title" placeholder="Ex: Installation logiciel comptable">
          <mat-error *ngIf="interventionForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" 
                    placeholder="Décrivez l'intervention en détail"></textarea>
          <mat-error *ngIf="interventionForm.get('description')?.hasError('required')">
            La description est requise
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Type d'intervention</mat-label>
            <mat-select formControlName="type">
              <mat-option value="HARDWARE_REPAIR">Réparation matériel</mat-option>
              <mat-option value="SOFTWARE_INSTALLATION">Installation logiciel</mat-option>
              <mat-option value="NETWORK_CONFIGURATION">Configuration réseau</mat-option>
              <mat-option value="SYSTEM_MAINTENANCE">Maintenance système</mat-option>
              <mat-option value="USER_TRAINING">Formation utilisateur</mat-option>
              <mat-option value="TECHNICAL_SUPPORT">Support technique</mat-option>
              <mat-option value="SECURITY_UPDATE">Mise à jour sécurité</mat-option>
              <mat-option value="DATA_BACKUP">Sauvegarde données</mat-option>
              <mat-option value="OTHER">Autre</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="LOW">Faible</mat-option>
              <mat-option value="MEDIUM">Moyenne</mat-option>
              <mat-option value="HIGH">Élevée</mat-option>
              <mat-option value="CRITICAL">Critique</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Poste comptable</mat-label>
          <mat-select formControlName="comptablePostId">
            <mat-option *ngFor="let post of comptablePosts" [value]="post.id">
              {{ post.postname }} - {{ post.codePC }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date d'intervention</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="interventionDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Durée estimée (heures)</mat-label>
          <input matInput type="number" formControlName="estimatedDuration" min="1" max="24">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description du problème</mat-label>
          <textarea matInput formControlName="problemDescription" rows="2" 
                    placeholder="Décrivez le problème à résoudre"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Équipement affecté</mat-label>
          <input matInput formControlName="equipmentAffected" 
                 placeholder="Ex: Ordinateur bureau, Imprimante, Serveur">
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="interventionForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Création...' : 'Créer l\'intervention' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .intervention-form {
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
export class InterventionCreateDialogComponent implements OnInit {
  interventionForm: FormGroup;
  comptablePosts: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InterventionCreateDialogComponent>,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.interventionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['SOFTWARE_INSTALLATION', Validators.required],
      priority: ['MEDIUM', Validators.required],
      comptablePostId: ['', Validators.required],
      interventionDate: [new Date(), Validators.required],
      estimatedDuration: [2, [Validators.required, Validators.min(1)]],
      problemDescription: [''],
      equipmentAffected: ['']
    });
  }

  ngOnInit() {
    this.loadComptablePosts();
  }

  loadComptablePosts() {
    this.http.get<any[]>('http://localhost:9090/api/comptable-posts').subscribe({
      next: (posts) => {
        this.comptablePosts = posts;
      },
      error: (error) => {
        console.error('Error loading comptable posts:', error);
        this.snackBar.open('Erreur lors du chargement des postes comptables', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    if (this.interventionForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.interventionForm.value;
      const currentUser = this.authService.getUser();
      
      const interventionData = {
        ...formValue,
        status: 'PENDING',
        createdById: currentUser?.id,
        itProfessionalId: currentUser?.role === 'IT_PROFESSIONAL' ? currentUser.id : null
      };

      this.http.post('http://localhost:9090/api/interventions', interventionData).subscribe({
        next: (result) => {
          this.snackBar.open('Intervention créée avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating intervention:', error);
          this.snackBar.open('Erreur lors de la création de l\'intervention', 'Fermer', {
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
