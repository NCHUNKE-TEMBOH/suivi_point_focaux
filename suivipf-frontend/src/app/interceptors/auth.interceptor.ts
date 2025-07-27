import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and add the authorization header if token exists
    let authReq = req;
    if (authToken && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
    }

    // Send the cloned request with header to the next handler
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          // Token might be expired or invalid
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
