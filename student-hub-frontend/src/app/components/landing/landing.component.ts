import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToTeacherPortal(): void {
    this.router.navigate(['/teacher/login']);
  }

  goToStudentPortal(): void {
    this.router.navigate(['/student/login']);
  }
}
