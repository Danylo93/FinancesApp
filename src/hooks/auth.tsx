import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  createUser: (userData: UserData) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginUser: async () => false,
  createUser: async () => {},
  logoutUser: async () => {},
});

interface UserData {
  email: string;
  password?: string;
  name: string;
}

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await login(email, password);
      if (response && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token); // Armazena o token também
        return true;
      } else {
        throw new Error('Dados de resposta inválidos');
      }
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const createUser = async (userData: UserData) => {
    try {
      const response = await register(userData.name, userData.email, userData.password || '');
      if (response && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token); // Armazena o token também
      } else {
        throw new Error('Dados de resposta inválidos');
      }
    } catch (error) {
      throw new Error('User creation failed');
    }
  };

  const logoutUser = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token'); // Remove o token também
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, createUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
