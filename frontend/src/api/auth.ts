import { http } from "@/lib/http";
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserDTO } from "@/api/types";

function unwrap<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    throw new Error(res.message || "请求失败");
  }
  if (res.data === undefined) {
    throw new Error("响应缺少 data 字段");
  }
  return res.data;
}

export const authApi = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await http.post<ApiResponse<AuthResponse>>("/api/auth/register", payload);
    return unwrap(data);
  },
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await http.post<ApiResponse<AuthResponse>>("/api/auth/login", payload);
    return unwrap(data);
  },
  async me(): Promise<UserDTO> {
    const { data } = await http.get<ApiResponse<UserDTO>>("/api/user/me");
    return unwrap(data);
  },
};

