import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-focal-point-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Assigner Point Focal</h2>
    
    <mat-dialog-content>
      <form [formGroup]="assignmentForm" class="assignment-form">
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Utilisateur à assigner</mat-label>
          <mat-select formControlName="userId">
            <mat-option *ngFor="let user of availableUsers" [value]="user.id">
              {{ user.firstName }} {{ user.lastName }} ({{ user.username }})
            </mat-option>
          </mat-select>
          <mat-error *ngIf="assignmentForm.get('userId')?.hasError('required')">
            L'utilisateur est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Poste comptable</mat-label>
          <mat-select formControlName="comptablePostId">
            <mat-option *ngFor="let post of comptablePosts" [value]="post.id">
              {{ post.postname }} - {{ post.codePC }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="assignmentForm.get('comptablePostId')?.hasError('required')">
            Le poste comptable est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Région d'affectation</mat-label>
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
          <mat-error *ngIf="assignmentForm.get('region')?.hasError('required')">
            La région est requise
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Responsabilités</mat-label>
          <textarea matInput formControlName="responsibilities" rows="3" 
                    placeholder="Décrivez les responsabilités du point focal"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="2" 
                    placeholder="Notes additionnelles (optionnel)"></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              [disabled]="assignmentForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ isSubmitting ? 'Attribution...' : 'Assigner Point Focal' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .assignment-form {
      min-width: 500px;
      max-width: 600px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class FocalPointAssignmentDialogComponent implements OnInit {
  assignmentForm: FormGroup;
  availableUsers: any[] = [];
  comptablePosts: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FocalPointAssignmentDialogComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.assignmentForm = this.fb.group({
      userId: ['', Validators.required],
      comptablePostId: ['', Validators.required],
      region: ['', Validators.required],
      responsibilities: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadAvailableUsers();
    this.loadComptablePosts();
  }

  loadAvailableUsers() {
    this.http.get<any[]>('http://localhost:9090/api/users').subscribe({
      next: (users) => {
        // Filter users who can be focal points
        this.availableUsers = users.filter(user => 
          user.role === 'FOCAL_POINT' || user.role === 'SERVICE' || user.role === 'ADMIN'
        );
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', {
          duration: 3000
        });
      }
    });
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
    if (this.assignmentForm.valid) {
      this.isSubmitting = true;
      
      const assignmentData = {
        ...this.assignmentForm.value,
        assignedDate: new Date(),
        status: 'ACTIVE'
      };

      this.http.post('http://localhost:9090/api/focal-points', assignmentData).subscribe({
        next: (result) => {
          this.snackBar.open('Point focal assigné avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error assigning focal point:', error);
          this.snackBar.open('Erreur lors de l\'assignation du point focal', 'Fermer', {
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
