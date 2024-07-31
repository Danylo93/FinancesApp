import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  ScrollView
} from 'react-native';
import { useTheme } from 'styled-components';
import AuthContext from '../../hooks/auth';
import Toast from 'react-native-toast-message';
import {
  Title,
  EmailInput,
  PasswordInput,
  InputContainer
} from './styles';

// Lista de imagens de fundo
const backgrounds = [
  require('../../assets/fundo.jpg'),
  require('../../assets/fundo1.jpg'),
  require('../../assets/fundo2.jpg'),
];


export function SignIn({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(backgrounds[0]); // Inicialmente com a primeira imagem
  const theme = useTheme();
  const { loginUser, createUser, user, loading } = useContext(AuthContext);

  // Função para selecionar uma imagem aleatória
  const selectRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundImage(backgrounds[randomIndex]);
  };

  useEffect(() => {
    selectRandomBackground(); // Seleciona uma imagem aleatória ao carregar o componente
  }, [] );

  async function handleSignInWithEmail() {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Login feito com sucesso!',
          text2: 'Você está agora logado.',
          visibilityTime: 4000,
        });
        // Navegue para a tela principal ou onde for necessário
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Dados inválidos',
        text2: 'Verifique seu e-mail e senha e tente novamente.',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleSignUp() {
    setIsLoading(true);
    try {
      const user = await createUser({ email, password, name });
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Cadastro realizado!',
        text2: `Usuário ${name} registrado com sucesso.`,
        visibilityTime: 4000,
      });
      setIsRegistering(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Erro ao registrar',
        text2: error.message,
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage} // Usa a imagem de fundo selecionada aleatoriamente
        style={styles.imagemDeFundo}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleWrapper}>
            <Title style={styles.title}>
              Controle suas {'\n'}
              finanças de forma {'\n'}
              muito simples
            </Title>
          </View>
          
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
                  <View style={styles.passwordContainer}>
                    <PasswordInput
                      placeholder="Senha"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={{ ...styles.input, marginBottom: 10 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.showPasswordText}>
                        {showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Cadastrar</Text>
                    )}
                  </TouchableOpacity>
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
                    style={{ ...styles.input, marginBottom: 10 }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.passwordContainer}>
                    <PasswordInput
                      placeholder="Senha"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={{ ...styles.input, marginBottom: 10 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.showPasswordText}>
                        {showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignInWithEmail}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Entrar</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsRegistering(true)}>
                    <Text style={styles.toggleText}>Ainda não tem conta? Cadastre-se</Text>
                  </TouchableOpacity>
                </>
              )}
            </InputContainer>
          
        </ScrollView>
        <Toast />
      </ImageBackground>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagemDeFundo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    opacity: 0.5,
    elevation: 2,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#333333',
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  passwordContainer: {
    marginBottom: 10,
  },
  showPasswordText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleText: {
    fontWeight: '700',
    padding: 10,
    textAlign: 'center',
    color: '#fff',
  },
};
