import React, { useState, useContext } from 'react';
import {
  Container,
  Header,
  Title,
  BankList,
  BankCard,
  BankLogo,
  BankInfo,
  BankName,
  BankStatus,
  StatusText,
  ConnectButton,
  DisconnectButton,
  ButtonText,
  LoadingContainer,
  ActivityIndicator,
  EmptyContainer,
  EmptyText,
} from './styles';
import { useTheme } from 'styled-components';
import BankingContext from '../../context/BankingContext';
import { Bank } from '../../types';
import { BankConnection } from '../BankConnection';

export function BankSelection() {
  const theme = useTheme();
  const { banks, loading, connectBank, disconnectBank } = useContext(BankingContext);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [connectionModalVisible, setConnectionModalVisible] = useState(false);

  const handleConnect = (bank: Bank) => {
    setSelectedBank(bank);
    setConnectionModalVisible(true);
  };

  const handleDisconnect = async (bankId: string) => {
    try {
      await disconnectBank(bankId);
    } catch (error) {
      console.error('Error disconnecting bank:', error);
    }
  };

  const handleConnectionSuccess = () => {
    setConnectionModalVisible(false);
    setSelectedBank(null);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Conectar Bancos</Title>
      </Header>

      {banks.length === 0 ? (
        <EmptyContainer>
          <EmptyText>Nenhum banco disponível</EmptyText>
        </EmptyContainer>
      ) : (
        <BankList
          data={banks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BankCard style={{ borderLeftColor: item.color }}>
              <BankLogo>{item.logo}</BankLogo>
              <BankInfo>
                <BankName>{item.name}</BankName>
                <BankStatus isConnected={item.isConnected}>
                  <StatusText isConnected={item.isConnected}>
                    {item.isConnected ? 'Conectado' : 'Não conectado'}
                  </StatusText>
                  {item.isConnected && item.accountNumber && (
                    <StatusText isConnected={true} style={{ fontSize: 12, marginTop: 4 }}>
                      {item.accountNumber}
                    </StatusText>
                  )}
                </BankStatus>
              </BankInfo>
              {item.isConnected ? (
                <DisconnectButton onPress={() => handleDisconnect(item.id)}>
                  <ButtonText>Desconectar</ButtonText>
                </DisconnectButton>
              ) : (
                <ConnectButton onPress={() => handleConnect(item)}>
                  <ButtonText>Conectar</ButtonText>
                </ConnectButton>
              )}
            </BankCard>
          )}
        />
      )}

      <BankConnection
        visible={connectionModalVisible}
        bank={selectedBank}
        onClose={() => {
          setConnectionModalVisible(false);
          setSelectedBank(null);
        }}
        onSuccess={handleConnectionSuccess}
      />
    </Container>
  );
}

