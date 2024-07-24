import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { tokenCache } from '../storage/tokenCache';

const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('SignIn');
      }
    }
  }, [isSignedIn, isLoaded, navigation]);

  if (!isLoaded) {
    return null; // Ou algum tipo de carregamento
  }

  return isSignedIn ? <AppRoutes /> : <AuthRoutes />;
}

export function Routes() {
  return (
    <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <NavigationContainer>
        <InitialLayout />
      </NavigationContainer>
    </ClerkProvider>
  );
}
