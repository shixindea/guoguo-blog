"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LoginDialog } from "@/components/LoginDialog";

interface User {
  id: string;
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
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: (callback: () => void) => void;
  openLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: any) => {
    // Mock login API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: "1",
          name: "GuoGuo",
          email: "guoguo@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
          level: 5,
          isPro: true,
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setIsLoginModalOpen(false);
        
        // Execute pending callback if any
        if (pendingCallback) {
          pendingCallback();
          setPendingCallback(null);
        }
        
        resolve();
      }, 1000);
    });
  };

  const register = async (data: any) => {
    // Mock register API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: "2",
          name: "New User",
          email: data.email,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NewUser",
          level: 1,
          isPro: false,
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setIsLoginModalOpen(false);
        
        if (pendingCallback) {
          pendingCallback();
          setPendingCallback(null);
        }

        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const checkAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setPendingCallback(() => callback);
      setIsLoginModalOpen(true);
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
