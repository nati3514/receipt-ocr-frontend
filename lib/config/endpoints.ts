// API Base URL - This will be replaced by the environment variable at build time
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  

  // Receipts endpoints
  RECEIPTS: {
    BASE: `${API_BASE_URL}/api/receipts`,
    UPLOAD: `${API_BASE_URL}/api/receipts/upload`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/receipts/${id}`,
    ANALYZE: `${API_BASE_URL}/api/receipts/analyze`,
  },

  

  // GraphQL endpoint
  GRAPHQL: `${API_BASE_URL}/graphql`,

  // Other API endpoints can be added here
};

// Helper function to get the full URL for an image
// This handles cases where the image URL might be a full URL or a path
export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default API_ENDPOINTS;
