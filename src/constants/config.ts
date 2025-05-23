import { Platform } from 'react-native';

// Use appropriate API URL based on platform with multiple fallback options
export const API_URL = Platform.select({
  web: 'http://localhost:3000',
  // For Android emulator, 10.0.2.2 points to host machine's localhost
  android: 'http://10.0.2.2:3000',
  // For iOS simulator, localhost works
  ios: 'http://localhost:3000',
  // Default fallback using your local IP
  default: 'http://localhost:3000',
});

// API paths for mobile-specific endpoints
export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/mobile/auth/login',
    REGISTER: '/api/mobile/auth/register',
    PROFILE: '/api/mobile/user/profile',
    GOOGLE: '/api/mobile/auth/google',
  },
  STARTUP_CALLS: {
    LIST: '/api/mobile/startup-calls',
    DETAILS: (id: string) => `/api/mobile/startup-calls/${id}`,
    APPLY: (id: string) => `/api/mobile/startup-calls/${id}/apply`,
  },
  APPLICATIONS: {
    LIST: '/api/mobile/applications',
    DETAILS: (id: string) => `/api/mobile/applications/${id}`,
  }
};

export const CONFIG = {
  GOOGLE_WEB_CLIENT_ID: "YOUR_GOOGLE_WEB_CLIENT_ID", // Replace with your actual Google Web Client ID
  APP_NAME: "Startup Call Management",
  ENV: "development",
  COLORS: {
    primary: "#6200EE",
    secondary: "#03DAC6",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    error: "#B00020",
    text: "#000000",
    onSurface: "#000000",
    disabled: "#9E9E9E",
    placeholder: "#9E9E9E",
    backdrop: "rgba(0, 0, 0, 0.5)",
    notification: "#FF0000",
    gray: "#666666",
    white: "#FFFFFF",
  },
  FONTS: {
    regular: "System",
    medium: "System",
    light: "System",
    thin: "System",
  },
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;
