import { apiGet } from "@/lib/http";
import type { CategoryDTO, PageResponse, ArticleListItem } from "@/api/types";

export const categoryApi = {
  async list(): Promise<CategoryDTO[]> {
    return apiGet<CategoryDTO[]>("/api/categories");
  },

  async detail(id: number): Promise<CategoryDTO> {
    return apiGet<CategoryDTO>(`/api/categories/${id}`);
  },

  async articles(id: number, params?: { page?: number; size?: number }): Promise<PageResponse<ArticleListItem>> {
    return apiGet<PageResponse<ArticleListItem>>(`/api/categories/${id}/articles`, { params });
  },
};
