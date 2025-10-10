import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-register',
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class TeacherRegisterComponent {
  registerForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      teacherId: ['', [Validators.required, Validators.minLength(3)]],
      faculty: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        this.errorMessage = 'Image size must be less than 500KB';
        return;
      }
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('teacherId', this.registerForm.get('teacherId')?.value);
      formData.append('faculty', this.registerForm.get('faculty')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.authService.registerTeacher(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/teacher/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/teacher/login']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
