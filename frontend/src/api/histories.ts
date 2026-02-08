import { apiDelete, apiGet } from "@/lib/http";
import type { HistoryItemDTO, PageResponse } from "@/api/types";

export const historyApi = {
  async list(params?: { page?: number; size?: number }): Promise<PageResponse<HistoryItemDTO>> {
    return apiGet<PageResponse<HistoryItemDTO>>("/api/histories", { params });
  },

  async remove(id: number): Promise<void> {
    await apiDelete<void>(`/api/histories/${id}`);
  },

  async clear(): Promise<void> {
    await apiDelete<void>("/api/histories");
  },
};

