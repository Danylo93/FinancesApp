import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, TextInput, Text, TouchableOpacity,ImageBackground, View, ScrollView } from 'react-native';
import { useTheme } from 'styled-components';
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import GoogleSvg from '../../assets/google.svg'; // Se estiver usando o SVG
import { SignInSocialButton } from '../../components/SignInSocialButton';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
  EmailInput,
  PasswordInput,
  SignInButton,
  OrText,
  InputContainer
} from './styles';
import { login, register } from '../../services/api'; // Atualize o caminho se necessário

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const theme = useTheme();
  const googleOAuth = useOAuth({ strategy: 'oauth_google' });

  async function onGoogleSignIn() {
    try {
      setIsLoading(true);
      const oAuthFlow = await googleOAuth.startOAuthFlow();

      if (oAuthFlow.authSessionResult?.type === 'success') {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId });
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  async function handleSignInWithEmail() {
    try {
      const data = await login(email, password);
      Alert.alert('Login bem-sucedido', `Bem-vindo ${data.user.name}`);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  async function handleRegister() {
    try {
      const data = await register(name, email, password);
      Alert.alert('Registro bem-sucedido', `Usuário ${data.name} registrado com sucesso`);
      setIsRegistering(false);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
                source={require('../../assets/fundo.png')}
                style={styles.imagemDeFundo}
            >
      <StatusBar barStyle="light-content"
				backgroundColor="transparent"
				translucent />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        
          <TitleWrapper>
            <Title>
              Controle suas {'\n'}
              finanças de forma {'\n'}
              muito simples
            </Title>
          </TitleWrapper>

          <SignInTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SignInTitle>
        

       
          <FooterWrapper>
            <InputContainer>
              {isRegistering ? (
                <>
                  <TextInput
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    style={{ ...styles.input, marginBottom: 10 }}
                  />
                  <EmailInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <PasswordInput
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <SignInButton title="Registrar" onPress={handleRegister} />
                  <TouchableOpacity onPress={() => setIsRegistering(false)}>
                    <Text style={styles.toggleText}>Já tem uma conta? Faça login</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <EmailInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <PasswordInput
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <SignInButton title="Entrar" onPress={handleSignInWithEmail} />
                  <TouchableOpacity onPress={() => setIsRegistering(true)}>
                    <Text style={styles.toggleText}>Ainda não tem conta? Cadastre-se</Text>
                  </TouchableOpacity>
                </>
              )}

              <OrText>OU</OrText>

              <SignInSocialButton
                      title="Entrar com Google"
                       iconName="google"
                       onPress={onGoogleSignIn}
                />
            </InputContainer>

            {isLoading &&
              <ActivityIndicator
                color={theme.colors.shape}
                style={{ marginTop: 18 }}
              />}
          </FooterWrapper>
       
      </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = {
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#333333'
  },
  container: {
    flex: 1,
},
  toggleText: {
    fontWeight: '700',
    padding: 15,
    textAlign: 'center',
    color: '#4F4F4F'
  },
  imagemDeFundo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
}
};
