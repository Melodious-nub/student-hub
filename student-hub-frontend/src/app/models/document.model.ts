export interface Document {
  _id: string;
  title: string;
  subject: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  teacherId: string;
  faculty: string;
  image?: string;
  documentCount: number;
  lastDocumentUpdate?: string;
  documents: Document[];
}
