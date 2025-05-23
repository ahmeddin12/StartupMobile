import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_PATHS } from "../constants/config";
import { User, UserRole } from "../types/user";
import { Platform } from 'react-native';
import { fetchWithProxy } from './corsProxy';

/**
 * Auth Service for handling authentication in the mobile app
 * Works with the server-side endpoints that now have proper CORS headers
 */

// Get safe API URL with fallbacks and platform-specific adjustments
// Import getApiUrl from env constants
import { getApiUrl as getConfiguredApiUrl } from '../constants/env';

// Get the API URL, removing the /api suffix if needed for auth endpoints
const getApiUrl = () => {
  const apiUrl = getConfiguredApiUrl();
  // Remove /api suffix if present, as some auth endpoints might expect the base URL
  return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

// Enhanced fetch function with proper headers and error handling
const secureFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    // No more mock authentication - use real backend authentication
    console.log(`Making authenticated request to: ${url}`);
    
    // Log request details in development
    if (__DEV__) {
      console.log('Request options:', {
        url,
        method: options.method || 'GET',
        headers: options.headers,
        bodyLength: options.body ? (typeof options.body === 'string' ? options.body.length : 'non-string body') : 'no body'
      });
    }
    
    // For real API calls (when not mocking)
    const fetchOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'omit', // Omit credentials to avoid CORS preflight issues
      ...options,
    };

    console.log(`Making request to: ${url}`);
    const response = await fetch(url, fetchOptions);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      try {
        // Try to parse as JSON anyway
        return JSON.parse(text);
      } catch {
        // If not JSON, return as is
        return { text, status: response.status };
      }
    }
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    console.error('Fetch error:', error);
    throw error;
  }
};

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Get the full API URL without removing /api suffix
      const apiUrl = getApiUrl();
      console.log(`Logging in with email: ${email}`);
      console.log(`Using API URL: ${apiUrl}`);
      
      // Construct the full URL for the login endpoint
      // Remove any duplicate /api segments
      const loginUrl = `${apiUrl.endsWith('/api') ? apiUrl : apiUrl + '/api'}/mobile/auth/login`.replace('/api/api/', '/api/');
      console.log(`Login URL: ${loginUrl}`);
      
      // Make the request with proper headers
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Login failed with status ${response.status}: ${errorText}`);
        throw new Error(`Login failed: ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();
      console.log('Login response:', JSON.stringify(data, null, 2));

      // Check if we have a valid response with user and token
      if (data && data.user && data.token) {
        // Store auth data in AsyncStorage
        await AsyncStorage.setItem("authToken", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        console.log('Successfully logged in and stored auth data');
        return data;
      }
      
      // If we don't have the expected data structure
      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to login. Please check your credentials."
      );
    }
  },

  /**
   * Alternative login with NextAuth credentials flow
   */
  async loginWithCredentials(email: string, password: string): Promise<AuthResponse> {
    try {
      const apiUrl = getApiUrl();
      
      // Try standard login endpoint first with our improved secureFetch
      try {
        const data = await secureFetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          body: JSON.stringify({ email, password, remember: true }),
        });

        // Check if we have a valid response with user data
        if (data && data.user) {
          const authResponse = {
            user: data.user,
            token: data.token || data.accessToken || 'direct-auth'
          };
          
          await AsyncStorage.setItem("authToken", authResponse.token);
          await AsyncStorage.setItem("user", JSON.stringify(authResponse.user));
          
          return authResponse;
        }
      } catch (err) {
        console.log('Direct login failed, trying NextAuth flow');
      }

      // If direct login fails, try NextAuth flow
      // Get CSRF token
      const csrfResponse = await secureFetch(`${apiUrl}/api/auth/csrf`, {
        method: "GET",
      });

      const { csrfToken } = await csrfResponse.json();

      // Login with credentials
      const response = await secureFetch(`${apiUrl}/api/auth/callback/credentials`, {
        method: "POST",
        body: JSON.stringify({ 
          email, 
          password,
          redirect: false,
          csrfToken,
          callbackUrl: `${apiUrl}/api/auth/session` 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // Get session
      const sessionResponse = await secureFetch(`${apiUrl}/api/auth/session`, {
        method: "GET",
      });

      const session = await sessionResponse.json();
      
      if (!session || !session.user) {
        throw new Error("Session not established");
      }

      const authResponse = {
        user: session.user,
        token: session.accessToken || "session-auth"
      };

      await AsyncStorage.setItem("authToken", authResponse.token);
      await AsyncStorage.setItem("user", JSON.stringify(authResponse.user));
      
      return authResponse;
    } catch (error) {
      console.error('Credential login error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to login with credentials. Please check your email and password."
      );
    }
  },

  /**
   * Register a new user
   */
  async register(
    fullName: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<AuthResponse> {
    try {
      const apiUrl = getApiUrl();
      
      const response = await secureFetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to register. Please try again."
      );
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      throw new Error("Failed to logout");
    }
  },

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return !!token;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  },
};
