
/**
 * Global configuration for the SurePath AI frontend.
 * 
 * In development, it defaults to your local machine (5050).
 * In production (Vercel), usually the server is at the same origin (/api).
 */

const getApiBase = () => {
  // 1. Use environment variable if provided (highest priority)
  const envBase = import.meta.env.VITE_API_BASE;
  if (envBase) return envBase;

  // 2. Check window/hostname for production vs local
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If we're on anything that is NOT localhost, use relative paths (/api)
    // This handles Vercel domains, local IPs, and custom production domains.
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '';
    }

    // Otherwise, assume local dev server on port 5050
    return `http://${hostname}:5050`;
  }

  // Fallback for SSR or other environments
  return 'http://localhost:5050';
};

export const API_BASE = getApiBase();
