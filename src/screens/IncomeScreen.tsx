// src/screens/IncomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function IncomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receitas</Text>
      {/* Implementar a lógica para mostrar e gerenciar as receitas */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
