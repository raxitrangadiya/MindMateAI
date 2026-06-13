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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('mindmate_user');
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const createUser = async (name: string, examType: string) => {
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
  };

  const logout = () => {
    localStorage.removeItem('mindmate_user');
    localStorage.removeItem('mindmate_mock_journals');
    localStorage.removeItem('mindmate_mock_dashboard');
    setUser(null);
  };

  return {
    user,
    isLoading,
    createUser,
    logout,
  };
}
