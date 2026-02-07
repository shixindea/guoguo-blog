import axios from "axios";
import { notify } from "@/lib/notify";
import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/api/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (!value || typeof value !== "object") return false;
  return "success" in value && "code" in value;
}

http.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      notify("请求失败");
      return Promise.reject(new Error("请求失败"));
    }
    const data = res.data;
    if (isApiResponse(data)) {
      if (!data.success || data.code !== "OK") {
        notify(data.message || "请求失败");
        return Promise.reject(new Error(data.message || "请求失败"));
      }
    }
    return res;
  },
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    const data = error?.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = String((data as { message: unknown }).message ?? "");
      if (message) {
        notify(message);
      }
    } else {
      notify(error?.message || "网络错误");
    }
    return Promise.reject(error);
  }
);

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await http.request(config);
  const data = res.data;
  if (isApiResponse(data)) {
    return data.data as T;
  }
  return data as T;
}

export function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...(config || {}), url, method: "GET" });
}

export function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...(config || {}), url, method: "POST", data: body });
}

export function apiPut<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...(config || {}), url, method: "PUT", data: body });
}

export function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...(config || {}), url, method: "DELETE" });
}
