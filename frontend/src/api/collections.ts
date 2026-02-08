import { apiDelete, apiGet } from "@/lib/http";
import type { CollectionItemDTO, PageResponse } from "@/api/types";

export const collectionApi = {
  async list(params?: { page?: number; size?: number }): Promise<PageResponse<CollectionItemDTO>> {
    return apiGet<PageResponse<CollectionItemDTO>>("/api/collections", { params });
  },

  async remove(articleId: number): Promise<void> {
    await apiDelete<void>(`/api/collections/${articleId}`);
  },
};

