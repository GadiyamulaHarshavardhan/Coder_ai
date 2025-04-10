// src/app/auth/authService.ts
const API_BASE_URL = "http://localhost:8000";

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface UserData {
  username: string;
  email: string;
  password: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      body: formData,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid credentials');
    }

    const data = await response.json();
    storeToken(data.access_token);
    return data;
  } catch (error) {
    console.error('[AuthService] Login failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Authentication failed'
    );
  }
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });
    return response.ok;
  } catch (error) {
    console.error('[AuthService] Token verification failed:', error);
    return false;
  }
};

// Token management with server-side fallback
export const storeToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24}`; // 1 day
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || 
           document.cookie
             .split('; ')
             .find(row => row.startsWith('authToken='))
             ?.split('=')[1] || 
           null;
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Server-side compatible token getter
export const getServerToken = (): string | null => {
  if (typeof window === 'undefined') {
    const { cookies } = require('next/headers');
    return cookies().get('authToken')?.value || null;
  }
  return getToken();
};