export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  roles?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  agreeToTerms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

