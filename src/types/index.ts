export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  dob?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  content?: string;
  instructorId: string;
  instructorName?: string;
  createdAt: string;
  updatedAt: string;
  enrollmentId?: string;
}

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  dob?: string;
}
