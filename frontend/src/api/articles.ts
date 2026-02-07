import type {
  ArticleListItem,
  ArticleRequest,
  ArticleResponse,
  ArticleViewRequest,
  PageResponse,
} from "@/api/types";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http";

export const articleApi = {
  async list(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    order?: string;
    status?: string;
    categoryId?: number;
    tagId?: number;
    userId?: number;
    keyword?: string;
  }): Promise<PageResponse<ArticleListItem>> {
    return apiGet<PageResponse<ArticleListItem>>("/api/articles", { params });
  },

  async detail(id: number): Promise<ArticleResponse> {
    return apiGet<ArticleResponse>(`/api/articles/${id}`);
  },

  async create(payload: ArticleRequest): Promise<ArticleResponse> {
    return apiPost<ArticleResponse>("/api/articles", payload);
  },

  async update(id: number, payload: ArticleRequest): Promise<ArticleResponse> {
    return apiPut<ArticleResponse>(`/api/articles/${id}`, payload);
  },

  async remove(id: number): Promise<void> {
    await apiDelete<void>(`/api/articles/${id}`);
  },

  async drafts(params?: { page?: number; size?: number }): Promise<PageResponse<ArticleListItem>> {
    return apiGet<PageResponse<ArticleListItem>>("/api/articles/drafts", { params });
  },

  async search(params: { keyword: string; page?: number; size?: number }): Promise<PageResponse<ArticleListItem>> {
    return apiGet<PageResponse<ArticleListItem>>("/api/articles/search", { params });
  },

  async trending(params?: { limit?: number }): Promise<ArticleListItem[]> {
    return apiGet<ArticleListItem[]>("/api/articles/trending", { params });
  },

  async related(id: number, params?: { limit?: number }): Promise<ArticleListItem[]> {
    return apiGet<ArticleListItem[]>(`/api/articles/${id}/related`, { params });
  },

  async like(id: number): Promise<ArticleResponse> {
    return apiPost<ArticleResponse>(`/api/articles/${id}/like`);
  },

  async collect(id: number): Promise<ArticleResponse> {
    return apiPost<ArticleResponse>(`/api/articles/${id}/collect`);
  },

  async view(id: number, payload?: ArticleViewRequest): Promise<void> {
    await apiPost<void>(`/api/articles/${id}/view`, payload || {});
  },
};
