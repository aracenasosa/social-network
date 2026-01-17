export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  following?: number;
  createdAt: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user?: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
