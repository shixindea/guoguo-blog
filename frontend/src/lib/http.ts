import axios from "axios";
import { notify } from "@/lib/notify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

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
    const data = res.data;
    if (data && typeof data === "object" && "success" in data && "code" in data) {
      const success = Boolean((data as { success: unknown }).success);
      const code = String((data as { code: unknown }).code ?? "");
      const message = String((data as { message?: unknown }).message ?? "");
      if (!success || code !== "OK") {
        notify(message || "请求失败");
        return Promise.reject(new Error(message || "请求失败"));
      }
    }
    return res;
  },
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      notify("登录已过期，请重新登录");
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
