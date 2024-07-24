import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../global/styles/theme';
import { useAuth } from '@clerk/clerk-expo';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.header}>
      {user.photo ? (
        <Image source={{ uri: user.photo }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name?.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.username}>Olá, {user.name}</Text>
      <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.colors.background, // Cor roxa para o fundo do cabeçalho
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.text, // Cor mais clara para a borda
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.success_light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: theme.colors.secondary_light,
    fontSize: 20,
    fontFamily: theme.fonts.regular,
  },
  username: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text_dark // Texto branco para contraste com o fundo roxo
  },
  logoutButton: {
    padding: 5,
  },
});
