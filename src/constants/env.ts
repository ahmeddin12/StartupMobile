// Environment configuration for the mobile app
// This connects to the same database as the web app through the Next.js API

import { Platform } from 'react-native';

// Environment types
export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production'
}

// Current environment setting
export const CURRENT_ENV: Environment = Environment.Development;

// Database configuration
export const DATABASE_CONFIG = {
  // The mobile app connects to the database through the Next.js API
  // These match the Supabase PostgreSQL connection in the web app
  supabaseUrl: 'https://pavrxdgqgievmaahmgmf.supabase.co',
  region: 'eu-central-1',
  poolerPort: 6543,
  directPort: 5432,
};

// API configuration based on environment
export const API_CONFIG = {
  [Environment.Development]: {
    // Android emulator needs special IP for localhost
    // For physical devices, use your computer's actual IP address
    baseUrl: Platform.OS === 'android' 
      ? 'http://10.0.2.2:3000/api'  // For emulator 
      : 'http://localhost:3000/api',
    timeout: 10000
  },
  [Environment.Staging]: {
    baseUrl: 'https://startup-platform-staging.vercel.app/api',
    timeout: 15000
  },
  [Environment.Production]: {
    baseUrl: 'https://startup-platform.vercel.app/api', 
    timeout: 15000
  }
};

// Get the correct API URL based on environment and platform
export const getApiUrl = (): string => {
  // Get the base URL from config
  const baseUrl = API_CONFIG[CURRENT_ENV].baseUrl;
  
  // For local development, handle different device scenarios
  if (CURRENT_ENV === Environment.Development) {
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      // For physical Android devices, use your computer's actual IP address
      // e.g., return 'http://192.168.1.100:3000/api';
      return 'http://10.0.2.2:3000/api';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      // For physical iOS devices, use your computer's actual IP address
      return 'http://localhost:3000/api';
    } else if (Platform.OS === 'web') {
      // Web needs the full URL when running in development
      console.log('Using full URL for web platform');
      return 'http://localhost:3000/api';
    }
  }
  
  return baseUrl;
};

// Auth storage keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'user'
};

// OAuth configuration (matching Next.js OAuth providers)
export const OAUTH_CONFIG = {
  googleClientId: '429668383985-qc56aqktmgb5l4ij1o4mqr8vu6hql14l.apps.googleusercontent.com',
  githubClientId: 'Ov23liMs6YOBOEArMQNz'
};

// Feature flags
export const FEATURES = {
  enablePushNotifications: true,
  enableOfflineMode: false,
  enableAnalytics: CURRENT_ENV !== Environment.Development,
};
