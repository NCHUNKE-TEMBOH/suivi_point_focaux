import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ComptablePostService } from '../../services/comptable-post.service';
import { AuthService } from '../../services/auth.service';
import { InterventionCreateDialogComponent } from '../interventions/intervention-create-dialog/intervention-create-dialog.component';
import { UserCreateDialogComponent } from '../users/user-create-dialog/user-create-dialog.component';
import { ComptablePostCreateDialogComponent } from '../comptable-posts/comptable-post-create-dialog/comptable-post-create-dialog.component';
import { FocalPointAssignmentDialogComponent } from '../focal-points/focal-point-assignment-dialog/focal-point-assignment-dialog.component';
import { InterventionSheetCreateDialogComponent } from '../intervention-sheets/intervention-sheet-create-dialog/intervention-sheet-create-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="ministry-header">
        <h1>Tableau de Bord - Système de Suivi des Interventions IT</h1>
        <p>Ministère des Finances - République du Cameroun</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>people</mat-icon>
            <mat-card-title>Utilisateurs</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ userCount }}</div>
            <div class="stat-label">Utilisateurs actifs</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/users">Voir tous</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>business</mat-icon>
            <mat-card-title>Postes Comptables</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ postCount }}</div>
            <div class="stat-label">Postes enregistrés</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/comptable-posts">Voir tous</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>build</mat-icon>
            <mat-card-title>Interventions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ interventionCount }}</div>
            <div class="stat-label">Interventions ce mois</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/interventions">Voir toutes</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon>pending_actions</mat-icon>
            <mat-card-title>En Attente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ pendingCount }}</div>
            <div class="stat-label">Validations en attente</div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/interventions">Traiter</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Actions Rapides</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary"
                  *ngIf="canCreateInterventions()"
                  (click)="createIntervention()">
            <mat-icon>add</mat-icon>
            Nouvelle Intervention
          </button>

          <button mat-raised-button color="accent"
                  *ngIf="canManageUsers()"
                  (click)="createUser()">
            <mat-icon>person_add</mat-icon>
            Ajouter Utilisateur
          </button>

          <button mat-raised-button color="primary"
                  *ngIf="canManagePosts()"
                  (click)="createComptablePost()">
            <mat-icon>business</mat-icon>
            Ajouter Post Comptable
          </button>

          <button mat-raised-button color="accent"
                  *ngIf="canManageFocalPoints()"
                  (click)="assignFocalPoint()">
            <mat-icon>person_pin</mat-icon>
            Assigner Point Focal
          </button>

          <button mat-raised-button color="primary"
                  *ngIf="canCreateSheets()"
                  (click)="createInterventionSheet()">
            <mat-icon>description</mat-icon>
            Nouvelle Fiche
          </button>

          <button mat-raised-button color="accent"
                  *ngIf="canViewReports()"
                  routerLink="/reports">
            <mat-icon>assessment</mat-icon>
            Voir Rapports
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    .ministry-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #1e3a8a, #059669);
      color: white;
      border-radius: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1e3a8a;
    }

    .stat-label {
      color: #666;
      margin-top: 8px;
    }

    .quick-actions {
      margin-top: 30px;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 15px;
    }

    .action-buttons button {
      min-width: 200px;
    }

    mat-card-header mat-icon {
      margin-right: 10px;
      color: #1e3a8a;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userCount = 0;
  postCount = 0;
  interventionCount = 0;
  pendingCount = 0;

  constructor(
    private userService: UserService,
    private comptablePostService: ComptablePostService,
    private authService: AuthService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.userService.getActiveUsers().subscribe(users => {
      this.userCount = users.length;
    });

    this.comptablePostService.getAllComptablePosts().subscribe(posts => {
      this.postCount = posts.length;
    });

    // Load real intervention data
    this.http.get<any[]>('http://localhost:9090/api/interventions').subscribe({
      next: (interventions) => {
        this.interventionCount = interventions.length;
        this.pendingCount = interventions.filter(i => i.status === 'PENDING').length;
      },
      error: () => {
        // Fallback to mock data
        this.interventionCount = 3;
        this.pendingCount = 1;
      }
    });
  }

  // Button action methods
  createIntervention() {
    const dialogRef = this.dialog.open(InterventionCreateDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats(); // Refresh stats
      }
    });
  }

  createUser() {
    const dialogRef = this.dialog.open(UserCreateDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats(); // Refresh stats
      }
    });
  }

  createComptablePost() {
    const dialogRef = this.dialog.open(ComptablePostCreateDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats(); // Refresh stats
      }
    });
  }

  assignFocalPoint() {
    const dialogRef = this.dialog.open(FocalPointAssignmentDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats(); // Refresh stats
      }
    });
  }

  createInterventionSheet() {
    const dialogRef = this.dialog.open(InterventionSheetCreateDialogComponent, {
      width: '700px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats(); // Refresh stats
      }
    });
  }

  viewReports() {
    // Navigate to reports page
    window.location.href = '/reports';
  }

  // Permission check methods
  canCreateInterventions(): boolean {
    return this.authService.canCreateInterventions();
  }

  canManageUsers(): boolean {
    return this.authService.isAdmin();
  }

  canManagePosts(): boolean {
    return this.authService.isAdmin() || this.authService.canManageComptablePosts();
  }

  canManageFocalPoints(): boolean {
    return this.authService.canManageFocalPoints();
  }

  canCreateSheets(): boolean {
    return this.authService.canCreateInterventionSheets();
  }

  canViewReports(): boolean {
    return this.authService.canViewReports();
  }
}
