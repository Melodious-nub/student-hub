import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
  imports: [CommonModule, DocumentUploadComponent],
  standalone: true
})
export class TeacherDashboardComponent implements OnInit {
  currentUser: any;
  documents: Document[] = [];
  isLoading = false;
  showUploadForm = false;
  showUploadDropdown = false;
  selectedUploadType: 'file' | 'notice' = 'file';

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserValue();
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.documentService.getTeacherDocuments().subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.isLoading = false;
      }
    });
  }

  toggleUploadDropdown(): void {
    this.showUploadDropdown = !this.showUploadDropdown;
  }

  selectUploadType(type: 'file' | 'notice'): void {
    this.selectedUploadType = type;
    this.showUploadDropdown = false;
    this.showUploadForm = true;
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
  }

  onDocumentUploaded(): void {
    this.showUploadForm = false;
    this.loadDocuments();
  }

  deleteDocument(documentId: string): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(documentId).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (error) => {
          console.error('Error deleting document:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
