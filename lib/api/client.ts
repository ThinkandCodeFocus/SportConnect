import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, saveAccessToken, clearTokens } from "@/lib/utils/auth";
import { ApiError } from "@/lib/types/api";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000");

// Error response type from backend
interface ErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds JWT token to all requests if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // TODO: Implement token refresh logic here
      // For now, just clear tokens and redirect to login
      clearTokens();
      
      // Redirect to login page if in browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      
      return Promise.reject(error);
    }

    // Handle other errors
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
