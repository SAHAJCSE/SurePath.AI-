
/**
 * Global configuration for the SurePath AI frontend.
 * 
 * In development, it defaults to your local machine (5050).
 * In production (Vercel), you can set VITE_API_BASE to your hosted backend URL.
 */

const getApiBase = () => {
  // Use environment variable if available
  const envBase = import.meta.env.VITE_API_BASE;
  if (envBase) return envBase;

  // Fallback to localhost if we're running locally
  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:5050`;
};

export const API_BASE = getApiBase();
