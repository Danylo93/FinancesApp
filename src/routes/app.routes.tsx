import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppStack } from './AppStack'; // Importe o Stack Navigator
import { Resume } from '../screens/Resume';
import { Profile } from '../screens/Profile';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 10 : 0,
          height: Platform.OS === 'ios' ? 90 : 50
        }
      }}
    >
      <Screen
        name="Dashboard"
        component={AppStack} // Use o Stack Navigator aqui
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          )
        }}
      />

      <Screen
        name="Resumo"
        component={Resume} // Use o Stack Navigator aqui
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="pie-chart"
              size={size}
              color={color}
            />
          )
        }}
      />

      <Screen
        name="Perfil"
        component={Profile} // Use o Stack Navigator aqui
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="person"
              size={size}
              color={color}
            />
          )
        }}
      />
    </Navigator>
  );
}
