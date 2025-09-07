// Central API configuration for all services

export const API_PREFIX = '/api';

function stripTrailingSlash(url?: string): string | undefined {
  if (!url) return undefined;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// Backend (application/auth/user/llm) base URL
export const BACKEND_API_BASE_URL =
  stripTrailingSlash(process.env.EXPO_PUBLIC_BACKEND_URL) ||
  'https://udavit-backend.onrender.com';

// Blockchain/smart-contract related base URL
export const BLOCKCHAIN_API_BASE_URL =
  stripTrailingSlash(process.env.EXPO_PUBLIC_BLOCKCHAIN_URL) ||
  'https://smartcontract-backend.onrender.com';

// Helper to build a full URL from base + endpoint
export function buildApiUrl(baseUrl: string, endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}


