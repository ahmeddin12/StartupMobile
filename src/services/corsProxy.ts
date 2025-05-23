import { Platform } from 'react-native';

// CORS proxy URL for web environment
const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

/**
 * Utility function to handle CORS issues by using a proxy for web environments
 * @param url The original URL to fetch
 * @param options Fetch options
 * @returns Promise with the response
 */
export const fetchWithProxy = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Only use CORS proxy in web environment
  if (Platform.OS === 'web') {
    // Check if the URL is already using the proxy
    if (!url.startsWith(CORS_PROXY_URL) && !url.includes('localhost:8082')) {
      // Add CORS proxy to the URL
      const proxyUrl = `${CORS_PROXY_URL}${url}`;
      console.log(`Using CORS proxy for: ${url}`);
      return fetch(proxyUrl, options);
    }
  }
  
  // For native environments or URLs that don't need proxy
  return fetch(url, options);
};

/**
 * Alternative approach using a local proxy
 * This is useful when the CORS proxy service has request limits
 */
export const fetchWithLocalProxy = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (Platform.OS === 'web') {
    // For web, use the local proxy endpoint
    const localProxyUrl = 'http://localhost:8082/api/proxy';
    
    // Add the target URL as a query parameter
    const encodedUrl = encodeURIComponent(url);
    const proxyUrl = `${localProxyUrl}?url=${encodedUrl}`;
    
    console.log(`Using local proxy for: ${url}`);
    return fetch(proxyUrl, options);
  }
  
  // For native environments
  return fetch(url, options);
};
