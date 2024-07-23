// src/screens/AnalysisScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AnalysisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Análise</Text>
      {/* Implementar a lógica para mostrar e gerenciar a análise financeira */}
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
