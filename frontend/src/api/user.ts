import { apiGet, apiPut } from "@/lib/http";
import type { UserDTO } from "@/api/types";

export type UpdateMyProfileRequest = {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
};

export const userApi = {
  async me(): Promise<UserDTO> {
    return apiGet<UserDTO>("/api/user/me");
  },

  async updateMyProfile(payload: UpdateMyProfileRequest): Promise<UserDTO> {
    return apiPut<UserDTO>("/api/user/me", payload);
  },
};

