import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComptablePost } from '../models/comptable-post.model';

@Injectable({
  providedIn: 'root'
})
export class ComptablePostService {
  private apiUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}

  getAllComptablePosts(): Observable<ComptablePost[]> {
    return this.http.get<ComptablePost[]>(`${this.apiUrl}/AllCountablePost`);
  }

  getComptablePostById(id: number): Observable<ComptablePost> {
    return this.http.get<ComptablePost>(`${this.apiUrl}/api/comptable-posts/${id}`);
  }

  createComptablePost(post: ComptablePost): Observable<ComptablePost> {
    return this.http.post<ComptablePost>(`${this.apiUrl}/api/comptable-posts`, post);
  }

  updateComptablePost(id: number, post: ComptablePost): Observable<ComptablePost> {
    return this.http.put<ComptablePost>(`${this.apiUrl}/api/comptable-posts/${id}`, post);
  }

  deleteComptablePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/comptable-posts/${id}`);
  }
}
