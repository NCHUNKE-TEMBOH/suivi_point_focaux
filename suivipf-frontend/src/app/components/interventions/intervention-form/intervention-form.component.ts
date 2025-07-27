import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-intervention-form',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Nouvelle Intervention</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Formulaire en cours de développement...</p>
      </mat-card-content>
    </mat-card>
  `
})
export class InterventionFormComponent {}
