import styled from 'styled-components/native';
import { TextInput, Button, Text, TouchableOpacity, View } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center; 
  align-items: center; 
  padding: 0 20px; 
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  width: 100%; 
  padding: 20px; 
`;

export const TitleWrapper = styled.View`
  align-items: center;
  margin-bottom: 20px; 
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 30px;
  color: ${({ theme }) => theme.colors.shape};
  text-align: center;
`;

export const SignInTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.shape};
  text-align: center;
  margin-top: 20px;
`;

export const InputContainer = styled.View`
 
  padding: 20px;
  border-radius: 8px;
  width: 100%; 
  max-width: 400px; 
  
`;

export const EmailInput = styled(TextInput)`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 10px;
  padding-horizontal: 10px;
  border-radius: 8px;
`;

export const PasswordInput = styled(TextInput)`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 10px;
  padding-horizontal: 10px;
  border-radius: 8px;
`;

export const SignInButton = styled(Button)`
  margin-bottom: 20px;
`;

export const GoogleButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #4285F4; 
  padding: 10px;
  border-radius: 8px;
  width: 100%; 
`;

export const GoogleButtonText = styled.Text`
  margin-left: 10px;
  color: #fff;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const FooterWrapper = styled.View`
  width: 100%;
  padding: 0 28px;
  justify-content: center;
  align-items: center;
`;
