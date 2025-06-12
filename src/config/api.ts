// API configuration based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dev-bruttobar.apprunner.dk';

export const getApiUrl = (endpoint: string): string => {
    // In production, use the full URL
    return `${API_BASE_URL}${endpoint}`;
};

export const apiConfig = {
    baseUrl: API_BASE_URL,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
};
