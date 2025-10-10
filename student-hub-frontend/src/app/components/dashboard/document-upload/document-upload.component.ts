import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class DocumentUploadComponent {
  @Output() documentUploaded = new EventEmitter<void>();
  
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subject: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        this.errorMessage = 'File size must be less than 1MB';
        return;
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.ms-excel'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only PDF, Word, and Excel files are allowed';
        return;
      }
      
      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isUploading = true;
      this.errorMessage = '';

      const formData = new FormData();
      formData.append('title', this.uploadForm.get('title')?.value);
      formData.append('subject', this.uploadForm.get('subject')?.value);
      formData.append('document', this.selectedFile);

      this.documentService.uploadDocument(formData).subscribe({
        next: (response) => {
          this.isUploading = false;
          this.uploadForm.reset();
          this.selectedFile = null;
          this.documentUploaded.emit();
        },
        error: (error) => {
          this.isUploading = false;
          this.errorMessage = error.error?.message || 'Upload failed. Please try again.';
        }
      });
    }
  }

  cancel(): void {
    this.uploadForm.reset();
    this.selectedFile = null;
    this.errorMessage = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
