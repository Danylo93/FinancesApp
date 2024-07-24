import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { register } from '../services/api';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const data = await register(name, email, password);
      Alert.alert('Registro bem-sucedido', `Usuário ${data.name} registrado com sucesso`);
      // Navegue para a tela de login ou outra tela
    } catch (error) {
      Alert.alert('Erro');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}
