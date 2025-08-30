export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  createdAt: string;
  password: string;
}
export interface MockUser {
  id: string;
  name: string;
  lastname: string;
  createdAt: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
