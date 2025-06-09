// API configuration based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dev-bruttobar.apprunner.dk/';

export const getApiUrl = (endpoint: string): string => {
    // In development, we use the proxy (empty base URL)
    // In production, we use the full API URL
    if (import.meta.env.DEV) {
        return `/api${endpoint}`;
    }

    // In production, use the full URL
    return `${API_BASE_URL}${endpoint}`;
};

export const apiConfig = {
    baseUrl: API_BASE_URL,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
};
