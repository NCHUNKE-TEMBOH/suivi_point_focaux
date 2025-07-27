import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User, AuthState, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/auth';
  private tokenKey = 'suivipf_token';
  private userKey = 'suivipf_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.updateAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.updateAuthState({ ...this.authStateSubject.value, loading: true, error: null });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          
          this.updateAuthState({
            isAuthenticated: true,
            user: response.user,
            token: response.token,
            loading: false,
            error: null
          });
        }),
        catchError(error => {
          this.updateAuthState({
            ...this.authStateSubject.value,
            loading: false,
            error: error.error?.message || 'Login failed'
          });
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const token = this.getToken();

    // Always clear auth immediately for better UX
    this.clearAuth();

    // Try to notify backend, but don't wait for response
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: this.getAuthHeaders()
      }).subscribe({
        next: () => console.log('Logout notification sent to backend'),
        error: (error) => console.log('Logout backend call failed, but user is logged out locally', error)
      });
    }
  }

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.http.get<{valid: boolean}>(`${this.apiUrl}/validate`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.valid),
      catchError(() => {
        this.clearAuth();
        return new Observable<boolean>(observer => {
          observer.next(false);
          observer.complete();
        });
      })
    );
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
    
    this.router.navigate(['/login']);
  }

  private updateAuthState(newState: AuthState): void {
    this.authStateSubject.next(newState);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getUser();
    return user ? roles.includes(user.role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isService(): boolean {
    return this.hasRole(UserRole.SERVICE);
  }

  isFocalPoint(): boolean {
    return this.hasRole(UserRole.FOCAL_POINT);
  }

  isITProfessional(): boolean {
    return this.hasRole(UserRole.IT_PROFESSIONAL);
  }

  isAccountingPost(): boolean {
    return this.hasRole(UserRole.ACCOUNTING_POST);
  }

  isUser(): boolean {
    return this.hasRole(UserRole.USER);
  }

  // Permission methods based on role requirements
  canViewDashboardsAndReports(): boolean {
    return this.isAuthenticated(); // All authenticated users can view dashboards and reports
  }

  canManageUsers(): boolean {
    return this.isAdmin(); // Only admin can manage users
  }

  canManageFocalPoints(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.SERVICE]); // Admin has full access, Service manages focal points
  }

  canManageAccountingPosts(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.SERVICE]); // Admin has full access, Service manages accounting posts
  }

  canCreateInterventions(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.ACCOUNTING_POST, UserRole.IT_PROFESSIONAL, UserRole.FOCAL_POINT]);
  }

  canTrackInterventions(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.ACCOUNTING_POST, UserRole.IT_PROFESSIONAL, UserRole.FOCAL_POINT]);
  }

  canValidateInterventions(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.IT_PROFESSIONAL]); // Admin has full access, IT Professional validates interventions
  }

  canManageInterventions(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.IT_PROFESSIONAL]); // Admin has full access, IT Professional manages interventions
  }

  canCreateInterventionSheets(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.FOCAL_POINT, UserRole.IT_PROFESSIONAL]); // Admin has full access, Focal Point creates intervention sheets
  }

  canTrackInterventionSheets(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.FOCAL_POINT, UserRole.IT_PROFESSIONAL]); // Admin has full access, Focal Point tracks intervention sheets
  }

  // Admin-specific permissions
  canAccessAllServices(): boolean {
    return this.isAdmin(); // Admin can access everything
  }

  canManageAllUsers(): boolean {
    return this.isAdmin(); // Only admin can manage all users
  }

  canViewAllReports(): boolean {
    return this.isAdmin(); // Admin can view all reports
  }

  canViewReports(): boolean {
    return this.isAuthenticated(); // All logged in users can view reports
  }

  canManageComptablePosts(): boolean {
    return this.isAdmin() || this.hasRole(UserRole.SERVICE); // Admin and Service can manage comptable posts
  }

  canManageSystemSettings(): boolean {
    return this.isAdmin(); // Only admin can manage system settings
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
