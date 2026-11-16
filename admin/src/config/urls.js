/**
 * ============================================================
 * 🌐 RIZEWORLD CENTRAL URL CONFIGURATION
 * ============================================================
 * Is file me poore project ke saare URLs ek jagah defined hain.
 * Backend Render URL: https://portfolio-j73f.onrender.com
 * ============================================================
 */

// 1. LIVE BACKEND PRODUCTION URL (RENDER)
export const BACKEND_URL = 'https://portfolio-j73f.onrender.com';

// 2. BACKEND API BASE URL
export const API_BASE_URL = `${BACKEND_URL}/api`;

// 3. STATIC UPLOADS BASE URL
export const UPLOADS_BASE_URL = `${BACKEND_URL}/uploads`;

// 4. AUTHENTICATION & ADMIN ENDPOINTS
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  CURRENT_USER: `${API_BASE_URL}/auth/me`,
};

// 5. PORTFOLIO ASSETS & CRUD ENDPOINTS
export const PORTFOLIO_ENDPOINTS = {
  GRAPHICS: `${API_BASE_URL}/graphics`,
  VIDEOS: `${API_BASE_URL}/videos`,
  SEO: `${API_BASE_URL}/seo`,
  UPLOAD: `${API_BASE_URL}/upload`,
  STATS: `${API_BASE_URL}/stats`,
  HEALTH: `${API_BASE_URL}/health`,
};

// 6. FRONTEND PORTFOLIO PORTS & URLS
export const FRONTEND_URLS = {
  ADMIN: 'http://localhost:5176',
  GRAPHIC: 'http://localhost:5174',
  VIDEO: 'http://localhost:5175',
  SEO: 'http://localhost:5173',
};

// 7. DATABASE CLOUD CLUSTER INFO
export const DATABASE_INFO = {
  PROVIDER: 'MongoDB Atlas Cloud',
  CLUSTER: 'portfolio.fwiulw5.mongodb.net',
  DATABASE: 'rizeworld',
  STATUS: 'Live Cloud Connected',
};

export default {
  BACKEND_URL,
  API_BASE_URL,
  UPLOADS_BASE_URL,
  AUTH_ENDPOINTS,
  PORTFOLIO_ENDPOINTS,
  FRONTEND_URLS,
  DATABASE_INFO,
};
