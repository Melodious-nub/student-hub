import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, TeacherProfile } from '../models/document.model';
import { Teacher } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Upload document (Teacher only)
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/documents/upload`, formData, {
      headers: this.getHeaders()
    });
  }

  // Get teacher's documents (Teacher only)
  getTeacherDocuments(): Observable<{ success: boolean; documents: Document[] }> {
    return this.http.get<{ success: boolean; documents: Document[] }>(`${this.apiUrl}/documents/my-documents`, {
      headers: this.getHeaders()
    });
  }

  // Delete document (Teacher only)
  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}`, {
      headers: this.getHeaders()
    });
  }

  // Get all teachers (Student only)
  getAllTeachers(): Observable<{ success: boolean; teachers: Teacher[] }> {
    return this.http.get<{ success: boolean; teachers: Teacher[] }>(`${this.apiUrl}/documents/teachers`, {
      headers: this.getHeaders()
    });
  }

  // Get teacher profile with documents (Student only)
  getTeacherProfile(teacherId: string): Observable<{ success: boolean; teacher: TeacherProfile }> {
    return this.http.get<{ success: boolean; teacher: TeacherProfile }>(`${this.apiUrl}/documents/teacher/${teacherId}`, {
      headers: this.getHeaders()
    });
  }

  // Download document
  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/download/${documentId}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
