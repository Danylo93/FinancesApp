import React, { useContext } from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native'; 
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Routes } from './src/routes';
import { AuthProvider } from './src/hooks/auth';
import theme from './src/global/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });


  if (!fontsLoaded ) {
    return (
    <ActivityIndicator
    color={theme.colors.shape}
    style={{ marginTop: 18 }}
  />
    );
  }

  return (
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    
  );
}
