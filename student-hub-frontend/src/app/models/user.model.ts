export interface User {
  id: string;
  name: string;
  image?: string;
}

export interface Teacher extends User {
  teacherId: string;
  faculty: string;
  documentCount: number;
  lastDocumentUpdate?: string;
}

export interface Student extends User {
  studentId: string;
  department: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  teacher?: Teacher;
  student?: Student;
}
