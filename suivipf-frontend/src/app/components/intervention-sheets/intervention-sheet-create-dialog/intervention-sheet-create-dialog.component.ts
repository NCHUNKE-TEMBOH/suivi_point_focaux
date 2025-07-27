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
  selector: 'app-intervention-sheet-create-dialog',
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
    <h2 mat-dialog-title>Nouvelle Fiche d'Intervention</h2>
    
    <mat-dialog-content>
      <form [formGroup]="sheetForm" class="sheet-form">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Intervention associée</mat-label>
          <mat-select formControlName="interventionId">
            <mat-option *ngFor="let intervention of interventions" [value]="intervention.id">
              {{ intervention.title }} - {{ intervention.type }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="sheetForm.get('interventionId')?.hasError('required')">
            L'intervention est requise
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre de la fiche</mat-label>
          <input matInput formControlName="title" placeholder="Ex: Fiche d'intervention - Installation logiciel">
          <mat-error *ngIf="sheetForm.get('title')?.hasError('required')">
            Le titre est requis
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Date d'intervention</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="interventionDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Durée (heures)</mat-label>
            <input matInput type="number" formControlName="duration" min="0.5" max="24" step="0.5">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Technicien assigné</mat-label>
          <mat-select formControlName="technicianId">
            <mat-option *ngFor="let tech of technicians" [value]="tech.id">
              {{ tech.firstName }} {{ tech.lastName }} ({{ tech.username }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="DRAFT">Brouillon</mat-option>
            <mat-option value="SCHEDULED">Planifiée</mat-option>
            <mat-option value="IN_PROGRESS">En cours</mat-option>
            <mat-option value="COMPLETED">Terminée</mat-option>
            <mat-option value="CANCELLED">Annulée</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description des travaux</mat-label>
          <textarea matInput formControlName="workDescription" rows="4" 
                    placeholder="Décrivez en détail les travaux à effectuer"></textarea>
          <mat-error *ngIf="sheetForm.get('workDescription')?.hasError('required')">
            La description des travaux est requise
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Matériel nécessaire</mat-label>
          <textarea matInput formControlName="requiredMaterials" rows="3" 
                    placeholder="Listez le matériel et les outils nécessaires"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observations</mat-label>
          <textarea matInput formControlName="observations" rows="3" 
                    placeholder="Observations particulières ou contraintes"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Priorité</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="LOW">Faible</mat-option>
              <mat-option value="MEDIUM">Moyenne</mat-option>
              <mat-option value="HIGH">Élevée</mat-option>
              <mat-option value="URGENT">Urgente</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Coût estimé (FCFA)</mat-label>
            <input matInput type="number" formControlName="estimatedCost" min="0">
          </mat-form-field>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="sheetForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Création...' : 'Créer la fiche' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .sheet-form {
      min-width: 600px;
      max-width: 700px;
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
export class InterventionSheetCreateDialogComponent implements OnInit {
  sheetForm: FormGroup;
  interventions: any[] = [];
  technicians: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InterventionSheetCreateDialogComponent>,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sheetForm = this.fb.group({
      interventionId: ['', Validators.required],
      title: ['', Validators.required],
      interventionDate: [new Date(), Validators.required],
      duration: [2, [Validators.required, Validators.min(0.5)]],
      technicianId: [''],
      status: ['DRAFT', Validators.required],
      workDescription: ['', Validators.required],
      requiredMaterials: [''],
      observations: [''],
      priority: ['MEDIUM', Validators.required],
      estimatedCost: [0, Validators.min(0)]
    });
  }

  ngOnInit() {
    this.loadInterventions();
    this.loadTechnicians();
  }

  loadInterventions() {
    this.http.get<any[]>('http://localhost:9090/api/interventions').subscribe({
      next: (interventions) => {
        // Filter interventions that don't have sheets yet or are pending
        this.interventions = interventions.filter(i => 
          i.status === 'PENDING' || i.status === 'IN_PROGRESS'
        );
      },
      error: (error) => {
        console.error('Error loading interventions:', error);
        this.snackBar.open('Erreur lors du chargement des interventions', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  loadTechnicians() {
    this.http.get<any[]>('http://localhost:9090/api/users').subscribe({
      next: (users) => {
        // Filter users who are IT professionals
        this.technicians = users.filter(user => 
          user.role === 'IT_PROFESSIONAL' || user.role === 'ADMIN'
        );
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
        this.snackBar.open('Erreur lors du chargement des techniciens', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  onSubmit() {
    if (this.sheetForm.valid) {
      this.isSubmitting = true;
      
      const currentUser = this.authService.getUser();
      const sheetData = {
        ...this.sheetForm.value,
        createdById: currentUser?.id,
        createdDate: new Date()
      };

      this.http.post('http://localhost:9090/api/intervention-sheets', sheetData).subscribe({
        next: (result) => {
          this.snackBar.open('Fiche d\'intervention créée avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating intervention sheet:', error);
          this.snackBar.open('Erreur lors de la création de la fiche', 'Fermer', {
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
