import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <div class="system-settings-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>settings</mat-icon>
            Paramètres Système
          </mat-card-title>
          <mat-card-subtitle>
            Configuration et administration du système - Accès Administrateur uniquement
          </mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <div class="settings-grid">
        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="primary">people</mat-icon>
              Gestion des Utilisateurs
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gérer tous les utilisateurs du système, leurs rôles et permissions.</p>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Créer/Modifier/Supprimer des utilisateurs</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Assigner des rôles</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Gérer les permissions</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/users">
              <mat-icon>people</mat-icon>
              Gérer les Utilisateurs
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="accent">business</mat-icon>
              Postes Comptables
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Administration complète des postes comptables du ministère.</p>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Créer/Modifier des postes</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Gérer les statuts</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Assigner des services</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" routerLink="/comptable-posts">
              <mat-icon>business</mat-icon>
              Gérer les Postes
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="primary">person_pin</mat-icon>
              Points Focaux
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gestion des points focaux et de leurs affectations.</p>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Assigner des points focaux</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Gérer les affectations</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Suivre les activités</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/focal-points">
              <mat-icon>person_pin</mat-icon>
              Gérer les Points Focaux
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="warn">build</mat-icon>
              Interventions
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Supervision complète de toutes les interventions IT.</p>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Voir toutes les interventions</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Valider/Rejeter</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Générer des rapports</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="warn" routerLink="/interventions">
              <mat-icon>build</mat-icon>
              Gérer les Interventions
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="accent">assessment</mat-icon>
              Rapports et Analyses
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Accès complet à tous les rapports et analyses du système.</p>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Rapports détaillés</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Analyses statistiques</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Tableaux de bord</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" routerLink="/reports">
              <mat-icon>assessment</mat-icon>
              Voir les Rapports
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="primary">description</mat-icon>
              Fiches d'Intervention
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gestion complète des fiches d'intervention et documentation.</p>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Approuver les fiches</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Gérer les archives</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>check_circle</mat-icon>
                <div matListItemTitle>Contrôler la qualité</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/intervention-sheets">
              <mat-icon>description</mat-icon>
              Gérer les Fiches
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .system-settings-container {
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .setting-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .setting-card mat-card-content {
      flex: 1;
    }

    .setting-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .setting-card mat-list-item {
      height: auto;
      padding: 8px 0;
    }

    .setting-card mat-card-actions {
      padding: 16px;
      margin-top: auto;
    }

    .setting-card button {
      width: 100%;
    }
  `]
})
export class SystemSettingsComponent {}
