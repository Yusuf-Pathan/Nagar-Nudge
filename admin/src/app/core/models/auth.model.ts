export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
