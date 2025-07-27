import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }

        if (authState.user && requiredRoles.includes(authState.user.role)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }
}
