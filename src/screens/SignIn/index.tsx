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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
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

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text === '') {
      setEmailError('O e-mail é obrigatório.');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('O e-mail deve ser válido.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text === '') {
      setPasswordError('A senha é obrigatória.');
    } else if (text.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
    } else {
      setPasswordError('');
    }
  };

  const handleNameChange = (text) => {
    setName(text);
    if (text === '') {
      setNameError('O nome é obrigatório.');
    } else {
      setNameError('');
    }
  };

  const validateFields = () => {
    let isValid = true;

    // Validação do email
    if (!email) {
      setEmailError('O e-mail é obrigatório.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('O e-mail deve ser válido.');
      isValid = false;
    }

    // Validação da senha
    if (!password) {
      setPasswordError('A senha é obrigatória.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      isValid = false;
    }

    // Validação do nome
    if (isRegistering && !name) {
      setNameError('O nome é obrigatório.');
      isValid = false;
    }

    return isValid;
  };

  async function handleSignInWithEmail() {
    if (!validateFields()) return;

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
    if (!validateFields()) return;

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
                    onChangeText={handleNameChange}
                    style={{ ...styles.input, marginBottom: 10 }}
                  />
                  {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    style={{ ...styles.input, marginBottom: 10 }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Senha"
                      value={password}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={!showPassword}
                      style={{ ...styles.input, marginBottom: 10 }}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    style={{ ...styles.input, marginBottom: 10 }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Senha"
                      value={password}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={!showPassword}
                      style={{ ...styles.input, marginBottom: 10 }}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
    padding: 20,
  },
  imagemDeFundo: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  titleWrapper: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
};
