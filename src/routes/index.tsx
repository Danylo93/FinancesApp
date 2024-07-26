import React, { useContext, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { tokenCache } from '../storage/tokenCache';
import AuthContext from '../hooks/auth';




export function Routes() {

  const { user, loading } = useContext(AuthContext);

  return (
      <NavigationContainer>
        {user ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    
  );
}
