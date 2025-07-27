import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirm-dialog">
      <div mat-dialog-title class="dialog-header">
        <mat-icon color="warn">warning</mat-icon>
        <span>{{ data.title || 'Confirmation' }}</span>
      </div>

      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Annuler' }}
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          {{ data.confirmText || 'Confirmer' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 350px;
      max-width: 500px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .dialog-content {
      margin-bottom: 16px;
    }

    .dialog-content p {
      margin: 0;
      color: #333;
      line-height: 1.5;
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
    }

    mat-dialog-actions button {
      margin-left: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
