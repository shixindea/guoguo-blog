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

export interface PageResponse<T> {
  page: number;
  size: number;
  total: number;
  list: T[];
}

export interface TagDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount?: number;
  recommended?: boolean;
  createdAt?: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  parentId?: number;
  articleCount?: number;
  createdAt?: string;
}

export type ArticleStatus = "DRAFT" | "PUBLISHED" | "PRIVATE" | "DELETED";
export type ArticleVisibility = "PUBLIC" | "PRIVATE" | "PASSWORD" | "PAID";

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  coverImage?: string;
  summary?: string;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  author: UserDTO;
  category?: CategoryDTO;
  tags: TagDTO[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt?: string;
}

export interface ArticleResponse {
  id: number;
  title: string;
  slug: string;
  coverImage?: string;
  summary?: string;
  content: string;
  htmlContent?: string;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  category?: CategoryDTO;
  tags: TagDTO[];
  author: UserDTO;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  liked?: boolean;
  collected?: boolean;
}

export interface ArticleRequest {
  title: string;
  slug?: string;
  coverImage?: string;
  summary?: string;
  content: string;
  status?: ArticleStatus;
  visibility?: ArticleVisibility;
  password?: string;
  price?: number;
  categoryId?: number;
  tagIds?: number[];
  scheduledAt?: string;
}

export interface ArticleViewRequest {
  progress?: number;
  lastPosition?: number;
  readDuration?: number;
}
