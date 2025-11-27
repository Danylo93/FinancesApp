import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';
import { Profile } from '../screens/Profile';
import { BankSelection } from '../modules/banking/screens/BankSelection';
import { BankTransactions } from '../modules/banking/screens/BankTransactions';

const Stack = createStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Perfil" component={Profile} />
      <Stack.Screen name="Resumo" component={Resume} />
      <Stack.Screen name="Cadastrar" component={Register} />
      <Stack.Screen name="BankSelection" component={BankSelection} />
      <Stack.Screen name="BankTransactions" component={BankTransactions} />
    </Stack.Navigator>
  );
}
