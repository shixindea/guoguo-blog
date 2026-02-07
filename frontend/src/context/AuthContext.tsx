"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LoginDialog } from "@/components/LoginDialog";
import { authApi } from "@/api/auth";
import type { LoginRequest, RegisterRequest, UserDTO } from "@/api/types";
import { setUnauthorizedHandler } from "@/lib/http";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  level: number;
  isPro: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: (callback: () => void) => void;
  openLoginModal: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUser(dto: UserDTO): User {
  return {
    id: dto.id,
    name: dto.displayName || dto.username,
    email: dto.email,
    avatar: dto.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    level: 1,
    isPro: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setPendingCallback(null);
      setIsLoginModalOpen(true);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const refreshUser = async () => {
    const me = await authApi.me();
    const mapped = mapUser(me);
    setUser(mapped);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(mapped));
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((me) => {
        const mapped = mapUser(me);
        setUser(mapped);
        localStorage.setItem("user", JSON.stringify(mapped));
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !pendingCallback) return;
    pendingCallback();
    setPendingCallback(null);
  }, [user, pendingCallback]);

  useEffect(() => {
    if (isLoading) return;
    if (user) return;
    if (!pendingCallback) return;
    setIsLoginModalOpen(true);
  }, [isLoading, user, pendingCallback]);

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    const mapped = mapUser(res.user);
    setUser(mapped);
    localStorage.setItem("user", JSON.stringify(mapped));
    setIsLoginModalOpen(false);
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const register = async (data: RegisterRequest) => {
    const res = await authApi.register(data);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    const mapped = mapUser(res.user);
    setUser(mapped);
    localStorage.setItem("user", JSON.stringify(mapped));
    setIsLoginModalOpen(false);
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const checkAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setPendingCallback(() => callback);
      if (!isLoading) {
        setIsLoginModalOpen(true);
      }
    }
  };

  const openLoginModal = () => {
    setPendingCallback(null);
    setIsLoginModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
        openLoginModal,
        refreshUser,
      }}
    >
      {children}
      <LoginDialog 
        open={isLoginModalOpen} 
        onOpenChange={(open) => {
          setIsLoginModalOpen(open);
          if (!open) setPendingCallback(null);
        }} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
