import { useState, useEffect } from 'react';
import { javaAPI } from '../axios';

interface AuthResponse {
  token: string;
}

interface AuthError {
  message: string;
  // Add other error properties if available from your API
}

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const isAuthenticated = !!token;

  const login = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await javaAPI.post<AuthResponse>('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      return response.data.token;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await javaAPI.post<AuthResponse>('/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      return response.data.token;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { login, register, logout, loading, error, token, isAuthenticated };
};

export default useAuth;
