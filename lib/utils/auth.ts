import Cookies from "js-cookie";

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "galsenfoot_access_token";
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "galsenfoot_refresh_token";

// Cookie options
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  expires: 7, // 7 days
};

/**
 * Save access token to cookies
 */
export const saveAccessToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    ...COOKIE_OPTIONS,
    expires: 1, // 1 day for access token
  });
};

/**
 * Get access token from cookies
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

/**
 * Remove access token from cookies
 */
export const removeAccessToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

/**
 * Save refresh token to cookies
 */
export const saveRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, COOKIE_OPTIONS);
};

/**
 * Get refresh token from cookies
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Remove refresh token from cookies
 */
export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY);
};

/**
 * Save both tokens
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);
};

/**
 * Remove all tokens (logout)
 */
export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * Check if user is authenticated (has access token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
