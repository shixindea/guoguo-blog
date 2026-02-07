import { http } from "@/lib/http";
import type {
  ApiResponse,
  ArticleListItem,
  ArticleRequest,
  ArticleResponse,
  ArticleViewRequest,
  PageResponse,
} from "@/api/types";

function unwrap<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    throw new Error(res.message || "请求失败");
  }
  if (res.data === undefined) {
    throw new Error("响应缺少 data 字段");
  }
  return res.data;
}

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
    const { data } = await http.get<ApiResponse<PageResponse<ArticleListItem>>>("/api/articles", { params });
    return unwrap(data);
  },

  async detail(id: number): Promise<ArticleResponse> {
    const { data } = await http.get<ApiResponse<ArticleResponse>>(`/api/articles/${id}`);
    return unwrap(data);
  },

  async create(payload: ArticleRequest): Promise<ArticleResponse> {
    const { data } = await http.post<ApiResponse<ArticleResponse>>("/api/articles", payload);
    return unwrap(data);
  },

  async update(id: number, payload: ArticleRequest): Promise<ArticleResponse> {
    const { data } = await http.put<ApiResponse<ArticleResponse>>(`/api/articles/${id}`, payload);
    return unwrap(data);
  },

  async remove(id: number): Promise<void> {
    const { data } = await http.delete<ApiResponse<void>>(`/api/articles/${id}`);
    unwrap(data);
  },

  async drafts(params?: { page?: number; size?: number }): Promise<PageResponse<ArticleListItem>> {
    const { data } = await http.get<ApiResponse<PageResponse<ArticleListItem>>>("/api/articles/drafts", { params });
    return unwrap(data);
  },

  async search(params: { keyword: string; page?: number; size?: number }): Promise<PageResponse<ArticleListItem>> {
    const { data } = await http.get<ApiResponse<PageResponse<ArticleListItem>>>("/api/articles/search", { params });
    return unwrap(data);
  },

  async trending(params?: { limit?: number }): Promise<ArticleListItem[]> {
    const { data } = await http.get<ApiResponse<ArticleListItem[]>>("/api/articles/trending", { params });
    return unwrap(data);
  },

  async related(id: number, params?: { limit?: number }): Promise<ArticleListItem[]> {
    const { data } = await http.get<ApiResponse<ArticleListItem[]>>(`/api/articles/${id}/related`, { params });
    return unwrap(data);
  },

  async like(id: number): Promise<ArticleResponse> {
    const { data } = await http.post<ApiResponse<ArticleResponse>>(`/api/articles/${id}/like`);
    return unwrap(data);
  },

  async collect(id: number): Promise<ArticleResponse> {
    const { data } = await http.post<ApiResponse<ArticleResponse>>(`/api/articles/${id}/collect`);
    return unwrap(data);
  },

  async view(id: number, payload?: ArticleViewRequest): Promise<void> {
    const { data } = await http.post<ApiResponse<void>>(`/api/articles/${id}/view`, payload || {});
    unwrap(data);
  },
};

