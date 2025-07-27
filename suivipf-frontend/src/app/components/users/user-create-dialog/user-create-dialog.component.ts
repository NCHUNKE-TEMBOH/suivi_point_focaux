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
  selector: 'app-user-create-dialog',
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
    <h2 mat-dialog-title>Ajouter Utilisateur</h2>
    
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="firstName" placeholder="Prénom">
            <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
              Le prénom est requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="lastName" placeholder="Nom de famille">
            <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
              Le nom est requis
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom d'utilisateur</mat-label>
          <input matInput formControlName="username" placeholder="nom.utilisateur">
          <mat-error *ngIf="userForm.get('username')?.hasError('required')">
            Le nom d'utilisateur est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="email@minfi.gov.cm">
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">
            L'email est requis
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">
            Format d'email invalide
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mot de passe</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Mot de passe">
          <mat-error *ngIf="userForm.get('password')?.hasError('required')">
            Le mot de passe est requis
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
            Le mot de passe doit contenir au moins 6 caractères
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Matricule</mat-label>
            <input matInput formControlName="matricule" placeholder="MAT001">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Téléphone</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="+237 6XX XXX XXX">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rôle</mat-label>
          <mat-select formControlName="role">
            <mat-option value="USER">Utilisateur</mat-option>
            <mat-option value="ACCOUNTING_POST">Poste Comptable</mat-option>
            <mat-option value="IT_PROFESSIONAL">Professionnel IT</mat-option>
            <mat-option value="FOCAL_POINT">Point Focal</mat-option>
            <mat-option value="SERVICE">Service</mat-option>
            <mat-option value="ADMIN">Administrateur</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('role')?.hasError('required')">
            Le rôle est requis
          </mat-error>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="userForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Création...' : 'Créer l\'utilisateur' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
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
export class UserCreateDialogComponent {
  userForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserCreateDialogComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      matricule: [''],
      phoneNumber: [''],
      role: ['USER', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      
      const userData = {
        ...this.userForm.value,
        status: 'ACTIVE'
      };

      this.http.post('http://localhost:9090/api/users', userData).subscribe({
        next: (result) => {
          this.snackBar.open('Utilisateur créé avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.snackBar.open('Erreur lors de la création de l\'utilisateur', 'Fermer', {
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
