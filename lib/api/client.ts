import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, saveAccessToken, clearTokens } from "@/lib/utils/auth";
import { ApiError } from "@/lib/types/api";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://galsenfoot-backend.onrender.com";
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
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest = requestUrl.includes("/api/auth/login") || requestUrl.includes("/api/auth/register");

    const data = error.response?.data as unknown as Record<string, unknown> | undefined;
    const hasMessage = !!data && typeof data.message === "string";
    const hasNestedErrors = !!data && typeof data.errors === "object" && data.errors !== null;
    const isFlatValidationMap = !!data && !hasMessage && !hasNestedErrors;

    const normalizedErrors = (hasNestedErrors
      ? (data?.errors as Record<string, string>)
      : (isFlatValidationMap ? (data as Record<string, string>) : undefined));

    const firstValidationError = normalizedErrors
      ? (Object.values(normalizedErrors)[0] as string | undefined)
      : undefined;

    // Handle timeout and network errors with user-friendly messages
    let normalizedMessage = (hasMessage ? (data?.message as string) : undefined)
      || firstValidationError
      || error.message
      || "An error occurred";

    // Convert technical timeout messages to user-friendly ones
    if (normalizedMessage.includes("timeout") || normalizedMessage.includes("ECONNABORTED")) {
      normalizedMessage = "Problème de Connexion - Le serveur met trop de temps à répondre";
    } else if (normalizedMessage.includes("Network") || normalizedMessage.includes("ECONNREFUSED")) {
      normalizedMessage = "Problème de Connexion - Vérifiez votre connexion internet";
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
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

    const apiError: ApiError = {
      message: normalizedMessage,
      status: error.response?.status || 500,
      errors: normalizedErrors,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
