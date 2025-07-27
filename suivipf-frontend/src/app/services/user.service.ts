import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  getUsersByService(serviceId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/active`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-username/${username}`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`);
  }
}
