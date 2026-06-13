import { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

export function useUser() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('mindmate_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('mindmate_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('mindmate_user');
      const storedToken = localStorage.getItem('mindmate_token');
      try {
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('mindmate_token', res.token);
      localStorage.setItem('mindmate_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      console.error('Login failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, examType: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, password, examType);
      localStorage.setItem('mindmate_token', res.token);
      localStorage.setItem('mindmate_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      console.error('Registration failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      localStorage.setItem('mindmate_token', res.token);
      localStorage.setItem('mindmate_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch (err: any) {
      console.error('Demo login failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mindmate_token');
    localStorage.removeItem('mindmate_user');
    localStorage.removeItem('mindmate_mock_journals');
    localStorage.removeItem('mindmate_mock_dashboard');
    sessionStorage.removeItem('mindmate_chat_session_id');
    
    // Clear all session chat logs
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mindmate_chat_')) {
        localStorage.removeItem(key);
        i--; // Adjust index since we removed an item
      }
    }
    
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    isLoading,
    login,
    register,
    demoLogin,
    logout,
    // Keep createUser for backward compatibility just in case
    createUser: async (name: string, examType: string) => {
      setIsLoading(true);
      try {
        const newUser = await api.onboardUser(name, examType);
        localStorage.setItem('mindmate_user', JSON.stringify(newUser));
        setUser(newUser);
      } catch (err) {
        console.error('Failed to create user', err);
      } finally {
        setIsLoading(false);
      }
    }
  };
}
