import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

/**
 * API client with CORS handling for web development and auth token management
 */
class ApiClient {
  /**
   * Make an API request with proper CORS and auth handling
   * @param endpoint - API endpoint (without the base URL)
   * @param options - Fetch options
   * @returns Response data
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Set up default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };
    
    // Add auth token if available
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token', error);
    }
    
    // Special handling for web CORS
    if (Platform.OS === 'web') {
      // For development web mode
      headers['Origin'] = 'http://localhost:8081';
      headers['Access-Control-Request-Method'] = options.method || 'GET';
    }
    
    const config: RequestInit = {
      ...options,
      headers,
      mode: 'cors', // Explicitly set mode for web
    };
    
    try {
      const response = await fetch(url, config);
      
      // Handle common error responses
      if (!response.ok) {
        if (response.status === 401) {
          // Clear auth token on 401 (Unauthorized)
          await AsyncStorage.removeItem('authToken');
        }
        
        // Try to parse error JSON
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        } catch (e) {
          // If JSON parsing fails, use status text
          throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }
      }
      
      // Return parsed JSON or empty object if no content
      if (response.status === 204) {
        return {} as T;
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`API error for ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Convenience methods
  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

export default apiClient;
