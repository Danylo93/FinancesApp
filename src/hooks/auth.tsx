import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<string>;
  createUser: (userData: UserData) => Promise<string>;
  logoutUser: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginUser: async () => 'Falha ao fazer login',
  createUser: async () => 'Falha ao criar usuário',
  logoutUser: async () => 'Falha ao fazer logout',
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

  const loginUser = async (email: string, password: string): Promise<string> => {
    try {
      const response = await login(email, password);
      if (response && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token); // Armazena o token também
        return 'Login realizado com sucesso';
      } else {
        throw new Error('Dados de resposta inválidos');
      }
    } catch (error) {
      console.error('Login failed', error);
      return error.message || 'Falha ao fazer login';
    }
  };

  const createUser = async (userData: UserData): Promise<string> => {
    try {
      const response = await register(userData.name, userData.email, userData.password || '');
      if (response && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('token', response.token); // Armazena o token também
        return 'Cadastro realizado com sucesso';
      } else {
        throw new Error('Dados de resposta inválidos');
      }
    } catch (error) {
      console.error('User creation failed', error);
      return error.message || 'Falha ao criar usuário';
    }
  };

  const logoutUser = async (): Promise<string> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token'); // Remove o token também
      return 'Logout realizado com sucesso';
    } catch (error) {
      console.error('Logout failed', error);
      return error.message || 'Falha ao fazer logout';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, createUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
