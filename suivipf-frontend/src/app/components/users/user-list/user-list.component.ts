import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserCreateDialogComponent } from '../user-create-dialog/user-create-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="user-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Utilisateurs</mat-card-title>
          <mat-card-subtitle>Ministère des Finances - République du Cameroun</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="users" class="users-table">
              
              <ng-container matColumnDef="matricule">
                <th mat-header-cell *matHeaderCellDef>Matricule</th>
                <td mat-cell *matCellDef="let user">{{ user.matricule }}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nom Complet</th>
                <td mat-cell *matCellDef="let user">{{ user.firstName }} {{ user.lastName }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.email }}</td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rôle</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="getRoleColor(user.role)">{{ getRoleLabel(user.role) }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="getStatusColor(user.status)">{{ getStatusLabel(user.status) }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="service">
                <th mat-header-cell *matHeaderCellDef>Service</th>
                <td mat-cell *matCellDef="let user">{{ user.serviceName || 'Non assigné' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="primary" (click)="editUser(user)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="createUser()">
            <mat-icon>add</mat-icon>
            Ajouter Utilisateur
          </button>
          <button mat-raised-button color="accent" (click)="loadUsers()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
    }

    .table-container {
      overflow-x: auto;
      margin: 20px 0;
    }

    .users-table {
      width: 100%;
    }

    mat-chip {
      font-size: 12px;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['matricule', 'name', 'email', 'role', 'status', 'service', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
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
        this.loadUsers(); // Refresh the list
      }
    });
  }

  editUser(user: User) {
    console.log('Edit user:', user);
    // Navigate to edit user form or open dialog
  }

  deleteUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.loadUsers(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ACCOUNTING_POST': 'Poste Comptable',
      'IT_PROFESSIONAL': 'Professionnel IT',
      'FOCAL_POINT': 'Point Focal',
      'USER': 'Utilisateur',
      'SERVICE': 'Service',
      'ADMIN': 'Administrateur'
    };
    return labels[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'ACCOUNTING_POST': 'primary',
      'IT_PROFESSIONAL': 'accent',
      'FOCAL_POINT': 'primary',
      'USER': 'basic',
      'SERVICE': 'accent',
      'ADMIN': 'warn'
    };
    return colors[role] || 'basic';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'SUSPENDED': 'Suspendu'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'ACTIVE': 'primary',
      'INACTIVE': 'basic',
      'SUSPENDED': 'warn'
    };
    return colors[status] || 'basic';
  }


}
