// tokenUtils.ts

// TypeScript interface for the response from your refresh token endpoint
interface RefreshTokenResponse {
    token: string;
  }
  
  // Function to refresh the token
  export async function refreshToken(): Promise<string | null> {
    try {
      const response = await fetch("https://lp-botks47iq-adamn1225s-projects.vercel.app/api/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REFRESH_TOKEN}` // Replace with the token used for refreshing
        },
        body: JSON.stringify({ /* your data here */ })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: RefreshTokenResponse = await response.json();
      console.log("Token refreshed successfully:", data.token);
  
      // Store the new token securely (e.g., in localStorage)
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        return data.token;
      } else {
        throw new Error("No token received.");
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  
  // Function to get the stored token
  export function getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  // Function to make an authenticated API request
  export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<any> {
    // Retrieve the token from local storage
    const token = getStoredToken();
  
    // Add Authorization header if the token is available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, refresh it
          const newToken = await refreshToken();
          if (newToken) {
            // Retry the request with the new token
            return makeAuthenticatedRequest(url, options);
          }
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  