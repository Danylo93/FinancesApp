import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/auth';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login para continuar</Text>
      <Button title="Entrar com Google" onPress={handleSignIn} />
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
