import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ComptablePostService } from '../../../services/comptable-post.service';
import { ComptablePost } from '../../../models/comptable-post.model';
import { ComptablePostCreateDialogComponent } from '../comptable-post-create-dialog/comptable-post-create-dialog.component';

@Component({
  selector: 'app-comptable-post-list',
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
    <div class="post-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Postes Comptables</mat-card-title>
          <mat-card-subtitle>Ministère des Finances - République du Cameroun</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="posts" class="posts-table">
              
              <ng-container matColumnDef="codePc">
                <th mat-header-cell *matHeaderCellDef>Code PC</th>
                <td mat-cell *matCellDef="let post">{{ post.CodePc || post.codePc }}</td>
              </ng-container>

              <ng-container matColumnDef="postname">
                <th mat-header-cell *matHeaderCellDef>Nom du Poste</th>
                <td mat-cell *matCellDef="let post">{{ post.postname }}</td>
              </ng-container>

              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Localisation</th>
                <td mat-cell *matCellDef="let post">{{ post.location || 'Non spécifiée' }}</td>
              </ng-container>

              <ng-container matColumnDef="region">
                <th mat-header-cell *matHeaderCellDef>Région</th>
                <td mat-cell *matCellDef="let post">{{ post.region || 'Non spécifiée' }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let post">
                  <mat-chip [color]="getStatusColor(post.status)">{{ getStatusLabel(post.status) }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="focalPoints">
                <th mat-header-cell *matHeaderCellDef>Points Focaux</th>
                <td mat-cell *matCellDef="let post">{{ (post.focalPoints?.length || 0) }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let post">
                  <button mat-icon-button color="primary" (click)="viewPost(post)" matTooltip="Voir">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="editPost(post)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deletePost(post)" matTooltip="Supprimer">
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
          <button mat-raised-button color="primary" (click)="addPost()">
            <mat-icon>add</mat-icon>
            Ajouter Poste Comptable
          </button>
          <button mat-raised-button color="accent" (click)="refreshPosts()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .post-list-container {
      padding: 20px;
    }

    .table-container {
      overflow-x: auto;
      margin: 20px 0;
    }

    .posts-table {
      width: 100%;
    }

    mat-chip {
      font-size: 12px;
    }
  `]
})
export class ComptablePostListComponent implements OnInit {
  posts: ComptablePost[] = [];
  displayedColumns: string[] = ['codePc', 'postname', 'location', 'region', 'status', 'focalPoints', 'actions'];

  constructor(
    private comptablePostService: ComptablePostService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.comptablePostService.getAllComptablePosts().subscribe(
      posts => this.posts = posts,
      error => console.error('Error loading posts:', error)
    );
  }

  getStatusLabel(status: string): string {
    if (!status) return 'Actif';
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'MAINTENANCE': 'Maintenance'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    if (!status) return 'primary';
    const colors: { [key: string]: string } = {
      'ACTIVE': 'primary',
      'INACTIVE': 'basic',
      'MAINTENANCE': 'warn'
    };
    return colors[status] || 'basic';
  }

  addPost() {
    const dialogRef = this.dialog.open(ComptablePostCreateDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPosts(); // Refresh the list
      }
    });
  }

  viewPost(post: ComptablePost) {
    console.log('View post:', post);
    // Navigate to detail view
  }

  editPost(post: ComptablePost) {
    console.log('Edit post:', post);
    // Navigate to edit form or open dialog
  }

  deletePost(post: ComptablePost) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le poste "${post.postname}"?`)) {
      this.comptablePostService.deleteComptablePost(post.id!).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          this.loadPosts(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }

  refreshPosts() {
    this.loadPosts();
  }
}
