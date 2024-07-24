import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native'; 
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Routes } from './src/routes';
import { AuthProvider, useAuth } from './src/hooks/auth';
import theme from './src/global/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return <><ActivityIndicator
    color={theme.colors.shape}
    style={{ marginTop: 18 }}
  /></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
