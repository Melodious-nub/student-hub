import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DocumentService } from '../../../services/document.service';
import { Teacher } from '../../../models/user.model';
import { RelativeTimePipe } from '../../../pipes/relative-time.pipe';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  imports: [CommonModule, FormsModule, RelativeTimePipe],
  standalone: true
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any;
  teachers: Teacher[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserValue();
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.documentService.getAllTeachers().subscribe({
      next: (response) => {
        this.teachers = response.teachers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.isLoading = false;
      }
    });
  }

  viewTeacherProfile(teacherId: string): void {
    this.router.navigate(['/student/teacher', teacherId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  get filteredTeachers(): Teacher[] {
    if (!this.searchTerm) {
      return this.teachers;
    }
    return this.teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      teacher.faculty.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
