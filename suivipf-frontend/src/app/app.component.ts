import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';
import { User, UserRole } from './models/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <div class="app-container" *ngIf="isAuthenticated">
      <mat-toolbar color="primary" class="ministry-header">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>SuiviPF - Ministère des Finances du Cameroun</span>
        <span class="spacer"></span>

        <!-- User Menu -->
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <div class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
            <div class="user-role">{{ getRoleLabel(currentUser?.role) }}</div>
            <div class="user-username">{{ '@' + (currentUser?.username || '') }}</div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-button">
            <mat-icon color="warn">logout</mat-icon>
            <span>Déconnexion</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Tableau de Bord</span>
            </a>

            <!-- Interventions - Accounting Post, IT Professional, Focal Point can access -->
            <a mat-list-item routerLink="/interventions" routerLinkActive="active"
               *ngIf="canAccessInterventions()">
              <mat-icon>build</mat-icon>
              <span>Interventions</span>
            </a>

            <!-- Intervention Sheets - Focal Point and IT Professional -->
            <a mat-list-item routerLink="/intervention-sheets" routerLinkActive="active"
               *ngIf="canAccessInterventionSheets()">
              <mat-icon>description</mat-icon>
              <span>Fiches d'Intervention</span>
            </a>

            <!-- Users - Admin only -->
            <a mat-list-item routerLink="/users" routerLinkActive="active"
               *ngIf="canManageUsers()">
              <mat-icon>people</mat-icon>
              <span>Utilisateurs</span>
            </a>



            <!-- Comptable Posts - Admin and Service -->
            <a mat-list-item routerLink="/comptable-posts" routerLinkActive="active"
               *ngIf="canManageAccountingPosts()">
              <mat-icon>business</mat-icon>
              <span>Postes Comptables</span>
            </a>

            <!-- Focal Points - Admin and Service -->
            <a mat-list-item routerLink="/focal-points" routerLinkActive="active"
               *ngIf="canManageFocalPoints()">
              <mat-icon>person_pin</mat-icon>
              <span>Points Focaux</span>
            </a>

            <!-- Reports - All authenticated users -->
            <a mat-list-item routerLink="/reports" routerLinkActive="active">
              <mat-icon>assessment</mat-icon>
              <span>Rapports</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>

    <!-- Show router outlet for login page when not authenticated -->
    <router-outlet *ngIf="!isAuthenticated"></router-outlet>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .sidenav-container {
      flex: 1;
    }
    
    .sidenav {
      width: 250px;
      background-color: #f5f5f5;
    }
    
    .main-content {
      padding: 20px;
      background-color: #fafafa;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }
    
    mat-list-item {
      margin-bottom: 8px;
    }
    
    mat-icon {
      margin-right: 16px;
    }

    .user-info {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      min-width: 200px;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }

    .user-role {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .user-username {
      font-size: 11px;
      color: #999;
      margin-top: 2px;
      font-style: italic;
    }

    .logout-button {
      color: #d32f2f !important;
    }

    .logout-button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'SuiviPF - Système de Suivi des Interventions IT';
  isAuthenticated = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(authState => {
      this.isAuthenticated = authState.isAuthenticated;
      this.currentUser = authState.user;
    });
  }

  logout(): void {
    console.log('Logout initiated by user');
    this.authService.logout();
    // Force reload to ensure clean state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }

  canManageAccountingPosts(): boolean {
    return this.authService.canManageAccountingPosts();
  }

  canManageFocalPoints(): boolean {
    return this.authService.canManageFocalPoints();
  }

  canAccessInterventions(): boolean {
    return this.authService.canCreateInterventions() || this.authService.canTrackInterventions();
  }

  canAccessInterventionSheets(): boolean {
    return this.authService.canCreateInterventionSheets() || this.authService.canTrackInterventionSheets();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getRoleLabel(role?: UserRole): string {
    if (!role) return '';

    const labels: { [key in UserRole]: string } = {
      [UserRole.ACCOUNTING_POST]: 'Poste Comptable',
      [UserRole.IT_PROFESSIONAL]: 'Professionnel IT',
      [UserRole.FOCAL_POINT]: 'Point Focal',
      [UserRole.USER]: 'Utilisateur',
      [UserRole.SERVICE]: 'Service',
      [UserRole.ADMIN]: 'Administrateur'
    };

    return labels[role] || role;
  }
}
