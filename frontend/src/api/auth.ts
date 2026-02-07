import { apiGet, apiPost } from "@/lib/http";
import type { AuthResponse, LoginRequest, RegisterRequest, UserDTO } from "@/api/types";

export const authApi = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    return apiPost<AuthResponse>("/api/auth/register", payload);
  },
  async login(payload: LoginRequest): Promise<AuthResponse> {
    return apiPost<AuthResponse>("/api/auth/login", payload);
  },
  async me(): Promise<UserDTO> {
    return apiGet<UserDTO>("/api/user/me");
  },
};
