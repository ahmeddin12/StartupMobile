/**
 * Local CORS handling for development
 * Provides platform-specific URL transformations to handle CORS in different environments
 */

/**
 * Transforms API URLs based on platform needs
 * @param {string} url - The original API URL
 * @returns {string} - The transformed URL appropriate for the current platform
 */
export const getTransformedUrl = (url) => {
  // For web during development, we may need to transform the URL
  if (typeof window !== 'undefined') {
    // Check if it's a localhost URL
    if (url.includes('localhost:3000')) {
      console.log(`Original URL: ${url}`);
      // If testing on web, can use the full URL
      return url;
    }
  }
  
  // For native platforms or production, use URL as is
  return url;
};

/**
 * Enhanced fetch function that helps with CORS and platform-specific issues
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const fetchWithProxy = async (url, options = {}) => {
  // Transform URL based on platform
  const transformedUrl = getTransformedUrl(url);
  console.log(`Using URL: ${transformedUrl}`);
  
  // Add credentials setting for cookies
  const enhancedOptions = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'X-Requested-With': 'XMLHttpRequest',
    }
  };
  
  return fetch(transformedUrl, enhancedOptions);
};
