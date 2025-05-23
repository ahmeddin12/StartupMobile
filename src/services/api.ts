import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, CURRENT_ENV, AUTH_STORAGE_KEYS, Environment, getApiUrl } from '../constants/env';
import { API_PATHS } from '../constants/config';
import { Platform } from 'react-native';

// Create axios instance with appropriate configuration
const api: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG[CURRENT_ENV].timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Log API configuration in development
if (__DEV__) {
  console.log(`API configured with baseURL: ${getApiUrl()}`);
  console.log(`Running on platform: ${Platform.OS}`);
}

// Request interceptor for API calls
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: unknown) => {
    // Type guard for axios error
    const isAxiosError = (err: unknown): err is { config: any; response?: { status: number } } => 
      typeof err === 'object' && err !== null && 'config' in err;
      
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Clear auth data on unauthorized
        await AsyncStorage.multiRemove([AUTH_STORAGE_KEYS.TOKEN, AUTH_STORAGE_KEYS.USER]);
        // You could navigate to login screen here if using a navigation reference
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Define ID type - all endpoint IDs should be strings or numbers
type EndpointId = string | number;

// API endpoints matching the Next.js backend structure
export const endpoints = {
  auth: {
    login: API_PATHS.AUTH.LOGIN,
    register: API_PATHS.AUTH.REGISTER,
    logout: '/auth/logout',
    profile: API_PATHS.AUTH.PROFILE,
  },
  startups: {
    list: '/startups',
    create: '/startups',
    details: (id: EndpointId): string => `/startups/${id}`,
    update: (id: EndpointId): string => `/startups/${id}`,
    delete: (id: EndpointId): string => `/startups/${id}`,
  },
  startupCalls: {
    list: API_PATHS.STARTUP_CALLS.LIST,
    details: (id: EndpointId): string => API_PATHS.STARTUP_CALLS.DETAILS(id.toString()),
    apply: (id: EndpointId): string => API_PATHS.STARTUP_CALLS.APPLY(id.toString()),
  },
  applications: {
    list: API_PATHS.APPLICATIONS.LIST,
    create: '/startup-calls/applications',
    details: (id: EndpointId): string => API_PATHS.APPLICATIONS.DETAILS(id.toString()),
    update: (id: EndpointId): string => `/applications/${id}`,
  },
  reviews: {
    list: '/reviewer/applications',
    submit: (id: EndpointId): string => `/reviewer/applications/${id}/review`,
  },
  user: {
    profile: API_PATHS.AUTH.PROFILE,
    updateProfile: API_PATHS.AUTH.PROFILE,
  },
  sponsors: {
    dashboard: '/sponsor/dashboard',
    startupCalls: '/sponsor/startup-calls',
    apply: (id: EndpointId): string => `/sponsor/startup-calls/${id}/apply`,
  },
  admin: {
    users: '/admin/users',
    startups: '/admin/startups',
    applications: '/admin/applications',
    startupCalls: '/admin/startup-calls',
    approvals: '/admin/approvals',
    settings: '/admin/settings',
    details: (id: EndpointId): string => `/admin/users/${id}`,
  },
};

export default api;