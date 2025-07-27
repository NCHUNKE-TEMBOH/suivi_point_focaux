import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-header>
          <div class="error-icon">
            <mat-icon color="warn">block</mat-icon>
          </div>
          <mat-card-title>Accès Non Autorisé</mat-card-title>
          <mat-card-subtitle>Vous n'avez pas les permissions nécessaires</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p>
            Désolé, vous n'avez pas les autorisations nécessaires pour accéder à cette page.
            Veuillez contacter votre administrateur système si vous pensez qu'il s'agit d'une erreur.
          </p>
          
          <div class="actions">
            <button mat-raised-button color="primary" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Retour
            </button>
            
            <button mat-raised-button (click)="goToDashboard()">
              <mat-icon>dashboard</mat-icon>
              Tableau de Bord
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .unauthorized-card {
      max-width: 500px;
      text-align: center;
      padding: 40px;
    }

    .error-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .error-icon mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 30px;
    }

    .actions button {
      min-width: 120px;
    }

    mat-card-content p {
      margin-bottom: 20px;
      line-height: 1.6;
      color: #666;
    }
  `]
})
export class UnauthorizedComponent {

  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
