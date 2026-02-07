import { apiGet } from "@/lib/http";
import type { PageResponse, TagDTO, ArticleListItem } from "@/api/types";

export const tagApi = {
  async list(): Promise<TagDTO[]> {
    return apiGet<TagDTO[]>("/api/tags");
  },

  async detail(id: number): Promise<TagDTO> {
    return apiGet<TagDTO>(`/api/tags/${id}`);
  },

  async popular(): Promise<TagDTO[]> {
    return apiGet<TagDTO[]>("/api/tags/popular");
  },

  async articles(id: number, params?: { page?: number; size?: number }): Promise<PageResponse<ArticleListItem>> {
    return apiGet<PageResponse<ArticleListItem>>(`/api/tags/${id}/articles`, { params });
  },
};
