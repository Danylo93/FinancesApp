import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  ScrollView
} from 'react-native';
import { useTheme } from 'styled-components';
import * as WebBrowser from 'expo-web-browser';
import AuthContext from '../../hooks/auth';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  FooterWrapper,
  EmailInput,
  PasswordInput,
  SignInButton,
  InputContainer
} from './styles';

WebBrowser.maybeCompleteAuthSession();

export function SignIn({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const theme = useTheme();
  const { loginUser, createUser, user, loading } = useContext(AuthContext);

  // Redireciona se o usuário já estiver autenticado
  useEffect(() => {
    if (!loading && user) {
      navigation.replace('Dashboard', { userName: user.name });
    }
  }, [user, loading, navigation]);

  async function handleSignInWithEmail() {
    setIsLoading(true);
    try {
      const success = await loginUser(email, password);
      if (success) {
        navigation.replace('Dashboard', { userName: name });
      } else {
        Alert.alert('Erro de login', 'Credenciais inválidas.');
      }
    } catch (error) {
      Alert.alert('Erro de login', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp() {
    setIsLoading(true);
    try {
      const user = await createUser({ email, password, name });
      Alert.alert('Registro bem-sucedido', `Usuário ${user.name} registrado com sucesso`);
      setIsRegistering(false);
    } catch (error) {
      Alert.alert('Erro ao registrar', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/fundo.jpg')}
        style={styles.imagemDeFundo}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TitleWrapper>
            <Title>
              Controle suas {'\n'}
              finanças de forma {'\n'}
              muito simples
            </Title>
          </TitleWrapper>

          {/* <SignInTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SignInTitle> */}

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
                    style={{ ...styles.input, marginBottom: 10 }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <PasswordInput
                    placeholder="Senha"
                    value={password}
                    style={{ ...styles.input, marginBottom: 10 }}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <SignInButton title="Cadastrar" onPress={handleSignUp} />
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

              {isLoading && (
                <ActivityIndicator
                  color={theme.colors.shape}
                  style={{ marginTop: 18 }}
                />
              )}
            </InputContainer>
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
