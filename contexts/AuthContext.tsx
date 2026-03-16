"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, UserProfile, LoginRequest, RegisterRequest, AuthResponse } from "@/lib/types/api";
import { authAPI, userAPI } from "@/lib/api/endpoints";
import {
  saveTokens,
  clearTokens,
  isAuthenticated as checkAuth,
  getAccessToken,
  getRefreshToken,
} from "@/lib/utils/auth";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        try {
          await refreshUser();
        } catch (error) {
          console.error("Failed to fetch user:", error);
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authAPI.login(credentials);
      const authData: AuthResponse = response.data;

      // Save tokens
      saveTokens(authData.accessToken, authData.refreshToken);

      // Fetch full user data
      const userResponse = await userAPI.getById(authData.userId);
      setUser(userResponse.data);

      // Fetch user profile
      try {
        const profileResponse = await userAPI.getProfile(authData.userId);
        setProfile(profileResponse.data);
      } catch (error) {
        // Profile doesn't exist yet, that's okay
        setProfile(null);
      }

      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authAPI.register(data);
      const authData: AuthResponse = response.data;

      // Save tokens
      saveTokens(authData.accessToken, authData.refreshToken);

      // Fetch full user data
      const userResponse = await userAPI.getById(authData.userId);
      setUser(userResponse.data);

      // Profile doesn't exist yet for new users
      setProfile(null);

      router.push("/");
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authAPI.logout({ refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      setUser(null);
      setProfile(null);
      router.push("/login");
    }
  };

  const refreshUser = async () => {
    try {
      if (!checkAuth()) {
        throw new Error("Not authenticated");
      }

      // TODO: Implement a /me endpoint in backend for efficiency
      // For now, we need to decode the token or store userId
      // Using a workaround: we'll need userId from somewhere
      
      // This is a temporary solution - ideally backend should have /api/auth/me
      const token = getAccessToken();
      if (!token) {
        throw new Error("No access token");
      }

      // Decode JWT to get userId (basic decode, not verification)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub; // Assuming userId is in 'sub' claim

      const userResponse = await userAPI.getById(userId);
      setUser(userResponse.data);

      // Try to fetch profile
      try {
        const profileResponse = await userAPI.getProfile(userId);
        setProfile(profileResponse.data);
      } catch (error) {
        setProfile(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      let updatedProfile: UserProfile;

      if (profile) {
        // Update existing profile
        const response = await userAPI.updateProfile(user.id, data);
        updatedProfile = response.data;
      } else {
        // Create new profile
        const response = await userAPI.createProfile(user.id, data);
        updatedProfile = response.data;
      }

      setProfile(updatedProfile);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      throw new Error(error.message || "Failed to update profile");
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
