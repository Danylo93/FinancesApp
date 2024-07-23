import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = createContext({} as IAuthContextData);

const CLIENT_ID = '716466557712-65069dutb0p7tmemqt35sdsepl3rsjp2.apps.googleusercontent.com'; // Substitua pelo seu CLIENT_ID
const REDIRECT_URI = makeRedirectUri({ useProxy: true }); // Certifique-se de usar um proxy se estiver usando o Expo
const RESPONSE_TYPE = 'token';
const SCOPE = 'profile email';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@gofinances:user';

  // Atualize a configuração para o uso correto de useAuthRequest
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [SCOPE],
      redirectUri: REDIRECT_URI,
      responseType: RESPONSE_TYPE,
    },
    discovery
  );
  console.log('Redirect URI:', REDIRECT_URI);

  useEffect(() => {
    async function loadUserStorageDate() {
      try {
        const userStoraged = await AsyncStorage.getItem(userStorageKey);

        if (userStoraged) {
          const userLogged = JSON.parse(userStoraged) as User;
          setUser(userLogged);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setUserStorageLoading(false);
      }
    }

    loadUserStorageDate();
  }, []);

  async function signInWithGoogle() {
    if (!request || !promptAsync) {
      console.error('Auth request or promptAsync is not available');
      return;
    }

    try {
      const result = await promptAsync();

      if (result.type === 'success') {
        const { access_token } = result.params;
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`);
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      console.error('Error during sign-in with Google:', error);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, userStorageLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
