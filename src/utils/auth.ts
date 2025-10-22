/**
 * Authentication utilities for managing tokens and session expiry
 */

const TOKEN_KEY = 'noireiq_token';
const TOKEN_EXPIRY_KEY = 'noireiq_token_expiry';
const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Store authentication token with expiry time
 */
export const setAuthToken = (token: string): void => {
  const expiryTime = new Date().getTime() + SESSION_DURATION;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Get authentication token if it exists and is not expired
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  if (!token) return null;
  
  if (isTokenExpired()) {
    clearAuthToken();
    return null;
  }
  
  return token;
};

/**
 * Check if the current token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!expiryTime) return true;
  
  return new Date().getTime() > parseInt(expiryTime, 10);
};

/**
 * Clear authentication tokens from storage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Get remaining session time in seconds
 */
export const getRemainingSessionTime = (): number => {
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!expiryTime) return 0;
  
  const remaining = parseInt(expiryTime, 10) - new Date().getTime();
  return Math.max(0, Math.floor(remaining / 1000));
};

/**
 * Check if user is authenticated (has valid, non-expired token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
