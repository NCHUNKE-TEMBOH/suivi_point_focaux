import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comptable-post-create-dialog',
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
    <h2 mat-dialog-title>Ajouter Poste Comptable</h2>
    
    <mat-dialog-content>
      <form [formGroup]="postForm" class="post-form">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom du poste</mat-label>
          <input matInput formControlName="postname" placeholder="Ex: Poste Comptable Général">
          <mat-error *ngIf="postForm.get('postname')?.hasError('required')">
            Le nom du poste est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code PC</mat-label>
          <input matInput formControlName="codePC" placeholder="Ex: PGT001">
          <mat-error *ngIf="postForm.get('codePC')?.hasError('required')">
            Le code PC est requis
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Région</mat-label>
            <mat-select formControlName="region">
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
            <mat-error *ngIf="postForm.get('region')?.hasError('required')">
              La région est requise
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ville</mat-label>
            <input matInput formControlName="city" placeholder="Ex: Yaoundé">
            <mat-error *ngIf="postForm.get('city')?.hasError('required')">
              La ville est requise
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Localisation</mat-label>
          <input matInput formControlName="location" placeholder="Ex: Quartier Bastos, Rue 123">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" 
                    placeholder="Description du poste comptable"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="ACTIVE">Actif</mat-option>
            <mat-option value="INACTIVE">Inactif</mat-option>
            <mat-option value="MAINTENANCE">En maintenance</mat-option>
          </mat-select>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="postForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Création...' : 'Créer le poste' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .post-form {
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
export class ComptablePostCreateDialogComponent {
  postForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ComptablePostCreateDialogComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postForm = this.fb.group({
      postname: ['', Validators.required],
      codePC: ['', Validators.required],
      region: ['', Validators.required],
      city: ['', Validators.required],
      location: [''],
      description: [''],
      status: ['ACTIVE', Validators.required]
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.isSubmitting = true;
      
      const postData = this.postForm.value;

      this.http.post('http://localhost:9090/api/comptable-posts', postData).subscribe({
        next: (result) => {
          this.snackBar.open('Poste comptable créé avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating comptable post:', error);
          this.snackBar.open('Erreur lors de la création du poste comptable', 'Fermer', {
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
