export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: Role;
  avatarUrl?: string;
  dob?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  dob?: string;
}
