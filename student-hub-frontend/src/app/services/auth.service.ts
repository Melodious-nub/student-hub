import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, Teacher, Student } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Teacher registration
  registerTeacher(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/teacher/register`, formData)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  // Teacher login
  loginTeacher(credentials: { teacherId: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/teacher/login`, credentials)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  // Student registration
  registerStudent(userData: { name: string; studentId: string; department: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/student/register`, userData)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  // Student login
  loginStudent(credentials: { studentId: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/student/login`, credentials)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }

  // Get current user
  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    
    // Determine if it's teacher or student based on stored user type
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const endpoint = user.teacherId ? 'teacher' : 'student';
    
    return this.http.get(`${this.apiUrl}/auth/${endpoint}/me`, { headers });
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get current user
  getCurrentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Check if current user is teacher
  isTeacher(): boolean {
    const user = this.getCurrentUserValue();
    return user && user.teacherId;
  }

  // Check if current user is student
  isStudent(): boolean {
    const user = this.getCurrentUserValue();
    return user && user.studentId;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      const user = response.teacher || response.student;
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }
}
