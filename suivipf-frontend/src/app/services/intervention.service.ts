import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Intervention {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt?: Date;
  updatedAt?: Date;
  comptablePostId?: number;
  comptablePostName?: string;
  assignedToId?: number;
  assignedToName?: string;
  createdById?: number;
  createdByName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiUrl = 'http://localhost:9090/api/interventions';

  constructor(private http: HttpClient) {}

  getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.apiUrl);
  }

  getInterventionById(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/${id}`);
  }

  createIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(this.apiUrl, intervention);
  }

  updateIntervention(id: number, intervention: Intervention): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/${id}`, intervention);
  }

  deleteIntervention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validateIntervention(id: number): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiUrl}/${id}/validate`, {});
  }

  getPendingInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/status/PENDING`);
  }

  getInterventionsByUser(userId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/user/${userId}`);
  }

  getInterventionsByPost(postId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/post/${postId}`);
  }
}
