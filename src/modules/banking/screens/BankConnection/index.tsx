import React, { useState, useContext } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  ModalContent,
  Header,
  Title,
  CloseButton,
  CloseButtonText,
  Form,
  Input,
  InputLabel,
  Button,
  ButtonText,
  LoadingContainer,
  InfoText,
} from './styles';
import { useTheme } from 'styled-components';
import BankingContext from '../../context/BankingContext';
import { Bank } from '../../types';

interface BankConnectionProps {
  visible: boolean;
  bank: Bank | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BankConnection({
  visible,
  bank,
  onClose,
  onSuccess,
}: BankConnectionProps) {
  const theme = useTheme();
  const { connectBank, loading } = useContext(BankingContext);
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleConnect = async () => {
    if (!bank) return;

    if (!accountNumber.trim()) {
      Alert.alert('Erro', 'Por favor, informe o número da conta');
      return;
    }

    try {
      await connectBank(bank.id, {
        accountNumber: accountNumber.trim(),
        password: password.trim() || undefined,
      });
      
      Alert.alert('Sucesso', `Conectado ao ${bank.name} com sucesso!`, [
        {
          text: 'OK',
          onPress: () => {
            setAccountNumber('');
            setPassword('');
            onSuccess();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível conectar ao banco');
    }
  };

  const handleClose = () => {
    setAccountNumber('');
    setPassword('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <ModalContent>
            <Header>
              <Title>Conectar ao {bank?.name}</Title>
              <CloseButton onPress={handleClose}>
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </Header>

            <Form>
              <InfoText>
                Para fins de demonstração, você pode usar qualquer número de conta.
                Em produção, isso seria integrado com Open Banking ou API do banco.
              </InfoText>

              <InputLabel>Número da Conta</InputLabel>
              <Input
                placeholder="Digite o número da conta"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                autoCapitalize="none"
              />

              <InputLabel>Senha (Opcional)</InputLabel>
              <Input
                placeholder="Digite a senha (opcional)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              {loading ? (
                <LoadingContainer>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                </LoadingContainer>
              ) : (
                <Button onPress={handleConnect}>
                  <ButtonText>Conectar</ButtonText>
                </Button>
              )}
            </Form>
          </ModalContent>
        </Container>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

