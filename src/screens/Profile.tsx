import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import AuthContext, { AuthProvider } from '../hooks/auth'; // Supondo que você tem um hook para autenticação

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 20px;
`;

const InfoText = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.text};
`;

const LogoutButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 5px;
`;

const LogoutButtonText = styled.Text`
  color: ${(props) => props.theme.colors.background};
  font-size: 16px;
  text-align: center;
`;

export function Profile() {
  const navigation = useNavigation();
  const { user, loading, logoutUser } = useContext(AuthContext);

  function handleSignOut() {
    Alert.alert(
      "Confirmar Logout",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => logoutUser()
        }
      ]
    );
  }

  return (
    <Container>
      <ProfileImage source={{ uri: 'https://via.placeholder.com/100' }} />
      <InfoText>{user.name}</InfoText>
      <InfoText>{user.email}</InfoText>
      <LogoutButton onPress={handleSignOut}>
        <LogoutButtonText>Deslogar</LogoutButtonText>
      </LogoutButton>
    </Container>
  );
}
