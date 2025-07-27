import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card-container">
        <mat-card class="login-card">
          <mat-card-header class="login-header">
            <div class="ministry-logo">
              <mat-icon class="logo-icon">account_balance</mat-icon>
            </div>
            <mat-card-title>SuiviPF</mat-card-title>
            <mat-card-subtitle>Ministère des Finances du Cameroun</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nom d'utilisateur</mat-label>
                <input matInput 
                       formControlName="username" 
                       placeholder="Entrez votre nom d'utilisateur"
                       autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                  Le nom d'utilisateur est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Mot de passe</mat-label>
                <input matInput 
                       [type]="hidePassword ? 'password' : 'text'"
                       formControlName="password" 
                       placeholder="Entrez votre mot de passe"
                       autocomplete="current-password">
                <button mat-icon-button matSuffix 
                        (click)="hidePassword = !hidePassword" 
                        type="button"
                        [attr.aria-label]="'Hide password'" 
                        [attr.aria-pressed]="hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Le mot de passe est requis
                </mat-error>
              </mat-form-field>

              <div class="login-actions">
                <button mat-raised-button 
                        color="primary" 
                        type="submit" 
                        class="login-button"
                        [disabled]="loginForm.invalid || loading">
                  <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                  <span *ngIf="!loading">Se connecter</span>
                  <span *ngIf="loading">Connexion...</span>
                </button>
              </div>

              <div class="error-message" *ngIf="errorMessage">
                <mat-icon color="warn">error</mat-icon>
                <span>{{ errorMessage }}</span>
              </div>
            </form>
          </mat-card-content>

          <mat-card-footer class="login-footer">
            <p>Système de Suivi des Interventions IT</p>
            <p class="version">Version 1.0.0</p>
          </mat-card-footer>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a8a 0%, #059669 100%);
      padding: 20px;
    }

    .login-card-container {
      width: 100%;
      max-width: 400px;
    }

    .login-card {
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .ministry-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .logo-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #1e3a8a;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .login-actions {
      margin-top: 20px;
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #d32f2f;
      font-size: 14px;
      margin-top: 16px;
      padding: 12px;
      background-color: #ffebee;
      border-radius: 4px;
      border-left: 4px solid #d32f2f;
    }

    .login-footer {
      text-align: center;
      margin-top: 30px;
      color: #666;
      font-size: 12px;
    }

    .version {
      margin-top: 8px;
      font-size: 11px;
      opacity: 0.7;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Check if user is already authenticated
    this.authService.authState$.subscribe(authState => {
      if (authState.isAuthenticated) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Connexion réussie!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erreur de connexion. Veuillez réessayer.';
          this.snackBar.open(this.errorMessage, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
