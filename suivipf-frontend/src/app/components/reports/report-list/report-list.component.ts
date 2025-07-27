import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/auth.model';

interface ReportCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  roles: UserRole[];
  stats?: {
    count: number;
    label: string;
  };
}

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule
  ],
  template: `
    <div class="reports-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>assessment</mat-icon>
            Tableaux de Bord et Rapports
          </mat-card-title>
          <mat-card-subtitle>
            Visualisation des données - Ministère des Finances du Cameroun
          </mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <div class="reports-grid">
        <mat-card *ngFor="let report of getAvailableReports()" 
                  class="report-card" 
                  [class]="'report-' + report.color">
          <mat-card-header>
            <div mat-card-avatar class="report-avatar">
              <mat-icon>{{ report.icon }}</mat-icon>
            </div>
            <mat-card-title>{{ report.title }}</mat-card-title>
            <mat-card-subtitle>{{ report.description }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div *ngIf="report.stats" class="report-stats">
              <div class="stat-number">{{ report.stats.count }}</div>
              <div class="stat-label">{{ report.stats.label }}</div>
            </div>
            
            <div class="report-roles">
              <mat-chip *ngFor="let role of report.roles" 
                        [color]="getRoleColor(role)" 
                        class="role-chip">
                {{ getRoleLabel(role) }}
              </mat-chip>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button 
                    [color]="report.color" 
                    (click)="openReport(report)">
              <mat-icon>open_in_new</mat-icon>
              Voir le rapport
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-card class="summary-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>insights</mat-icon>
            Résumé des Activités
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="summary-grid">
            <div class="summary-item">
              <mat-icon color="primary">build</mat-icon>
              <div class="summary-content">
                <div class="summary-number">{{ totalInterventions }}</div>
                <div class="summary-label">Interventions totales</div>
              </div>
            </div>
            
            <div class="summary-item">
              <mat-icon color="accent">description</mat-icon>
              <div class="summary-content">
                <div class="summary-number">{{ totalSheets }}</div>
                <div class="summary-label">Fiches créées</div>
              </div>
            </div>
            
            <div class="summary-item">
              <mat-icon color="primary">business</mat-icon>
              <div class="summary-content">
                <div class="summary-number">{{ totalPosts }}</div>
                <div class="summary-label">Postes comptables</div>
              </div>
            </div>
            
            <div class="summary-item">
              <mat-icon color="accent">people</mat-icon>
              <div class="summary-content">
                <div class="summary-number">{{ totalUsers }}</div>
                <div class="summary-label">Utilisateurs actifs</div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-card {
      margin-bottom: 30px;
    }

    .header-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1e3a8a;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .report-card {
      transition: transform 0.2s ease-in-out;
      cursor: pointer;
    }

    .report-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .report-avatar {
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .report-primary .report-avatar {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .report-accent .report-avatar {
      background-color: #fce4ec;
      color: #c2185b;
    }

    .report-warn .report-avatar {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .report-stats {
      text-align: center;
      margin: 16px 0;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      color: #1e3a8a;
    }

    .stat-label {
      font-size: 0.9em;
      color: #666;
      margin-top: 4px;
    }

    .report-roles {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 12px;
    }

    .role-chip {
      font-size: 10px;
    }

    .summary-card {
      margin-top: 20px;
    }

    .summary-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1e3a8a;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .summary-content {
      flex: 1;
    }

    .summary-number {
      font-size: 1.8em;
      font-weight: bold;
      color: #1e3a8a;
    }

    .summary-label {
      font-size: 0.9em;
      color: #666;
      margin-top: 4px;
    }
  `]
})
export class ReportListComponent implements OnInit {
  totalInterventions = 3;
  totalSheets = 23;
  totalPosts = 12;
  totalUsers = 8;

  reports: ReportCard[] = [
    {
      title: 'Tableau de Bord Principal',
      description: 'Vue d\'ensemble des activités et statistiques générales',
      icon: 'dashboard',
      color: 'primary',
      route: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.SERVICE, UserRole.FOCAL_POINT, UserRole.IT_PROFESSIONAL, UserRole.ACCOUNTING_POST, UserRole.USER],
      stats: { count: 5, label: 'Widgets actifs' }
    },
    {
      title: 'Rapport des Interventions',
      description: 'Analyse détaillée des interventions par période et type',
      icon: 'build',
      color: 'primary',
      route: '/reports/interventions',
      roles: [UserRole.ADMIN, UserRole.SERVICE, UserRole.IT_PROFESSIONAL, UserRole.FOCAL_POINT, UserRole.ACCOUNTING_POST],
      stats: { count: this.totalInterventions, label: 'Interventions' }
    },
    {
      title: 'Rapport des Fiches',
      description: 'Suivi des fiches d\'intervention créées et leur statut',
      icon: 'description',
      color: 'accent',
      route: '/reports/sheets',
      roles: [UserRole.ADMIN, UserRole.FOCAL_POINT, UserRole.IT_PROFESSIONAL],
      stats: { count: this.totalSheets, label: 'Fiches' }
    },
    {
      title: 'Rapport des Postes Comptables',
      description: 'État et performance des postes comptables',
      icon: 'business',
      color: 'primary',
      route: '/reports/posts',
      roles: [UserRole.ADMIN, UserRole.SERVICE],
      stats: { count: this.totalPosts, label: 'Postes' }
    },
    {
      title: 'Rapport des Utilisateurs',
      description: 'Activité et gestion des utilisateurs du système',
      icon: 'people',
      color: 'accent',
      route: '/reports/users',
      roles: [UserRole.ADMIN],
      stats: { count: this.totalUsers, label: 'Utilisateurs' }
    },
    {
      title: 'Rapport de Performance',
      description: 'Métriques de performance et temps de réponse',
      icon: 'speed',
      color: 'warn',
      route: '/reports/performance',
      roles: [UserRole.ADMIN, UserRole.SERVICE, UserRole.IT_PROFESSIONAL],
      stats: { count: 98, label: '% Disponibilité' }
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Load actual statistics from services
    this.loadStatistics();
  }

  loadStatistics() {
    // Mock data - replace with actual service calls
    // this.userService.getActiveUsers().subscribe(users => this.totalUsers = users.length);
    // this.interventionService.getAllInterventions().subscribe(interventions => this.totalInterventions = interventions.length);
  }

  getAvailableReports(): ReportCard[] {
    const currentUser = this.authService.getUser();
    if (!currentUser) return [];

    return this.reports.filter(report => 
      report.roles.includes(currentUser.role)
    );
  }

  openReport(report: ReportCard) {
    console.log('Opening report:', report.title);
    // Navigate to the specific report
    // this.router.navigate([report.route]);
  }

  getRoleLabel(role: UserRole): string {
    const labels: { [key in UserRole]: string } = {
      [UserRole.ACCOUNTING_POST]: 'Poste Comptable',
      [UserRole.IT_PROFESSIONAL]: 'IT Pro',
      [UserRole.FOCAL_POINT]: 'Point Focal',
      [UserRole.USER]: 'Utilisateur',
      [UserRole.SERVICE]: 'Service',
      [UserRole.ADMIN]: 'Admin'
    };
    return labels[role] || role;
  }

  getRoleColor(role: UserRole): string {
    const colors: { [key in UserRole]: string } = {
      [UserRole.ACCOUNTING_POST]: 'primary',
      [UserRole.IT_PROFESSIONAL]: 'accent',
      [UserRole.FOCAL_POINT]: 'primary',
      [UserRole.USER]: 'basic',
      [UserRole.SERVICE]: 'accent',
      [UserRole.ADMIN]: 'warn'
    };
    return colors[role] || 'basic';
  }
}
