import { create } from "zustand";
import apiClient from "@/lib/axios";
import { setAccessToken, removeAccessToken, getAccessToken } from "@/lib/token";
import {
  User,
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "@/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials,
      );

      // Store access token
      setAccessToken(data.accessToken);

      // Update auth state
      set({
        user: data.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signup: async (data: SignupData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        data,
      );

      // If signup returns token, auto-login
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        set({
          user: response.data.user || null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call logout endpoint to clear refresh token cookie
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call result
      removeAccessToken();
      set({
        user: null,
        isAuthenticated: false,
      });

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  checkAuth: () => {
    const token = getAccessToken();
    set({ isAuthenticated: !!token });
  },

  clearError: () => {
    set({ error: null });
  },
}));
