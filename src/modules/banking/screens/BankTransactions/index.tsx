import React, { useState, useContext, useCallback } from 'react';
import { Alert, RefreshControl } from 'react-native';
import {
  Container,
  Header,
  Title,
  SyncButton,
  SyncButtonText,
  BankFilter,
  FilterButton,
  FilterButtonText,
  TransactionsList,
  EmptyContainer,
  EmptyText,
  LoadingContainer,
  ActivityIndicator,
} from './styles';
import { useTheme } from 'styled-components';
import BankingContext from '../../context/BankingContext';
import { BankTransaction } from '../../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TransactionCard } from '../../../components/TransactionCard';

interface FilterItem {
  id: string;
  name: string;
}

export function BankTransactions() {
  const theme = useTheme();
  const {
    banks,
    transactions,
    syncing,
    syncAllBanks,
    getTransactionsByBank,
  } = useContext(BankingContext);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const connectedBanks = banks.filter(b => b.isConnected);
  const filteredTransactions = selectedBankId
    ? getTransactionsByBank(selectedBankId)
    : transactions;
  
  const filterData: FilterItem[] = [{ id: 'all', name: 'Todos' }, ...connectedBanks];

  const handleSync = async () => {
    try {
      await syncAllBanks();
      Alert.alert('Sucesso', 'Transações sincronizadas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sincronizar as transações');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncAllBanks();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [syncAllBanks]);

  const formatTransaction = (transaction: BankTransaction) => {
    const amount = transaction.amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const date = format(parseISO(transaction.date), 'dd/MM/yyyy', {
      locale: ptBR,
    });

    return {
      id: transaction.id,
      name: transaction.description,
      amount,
      type: transaction.type === 'credit' ? 'positive' : 'negative',
      category: transaction.category || 'other',
      date,
    };
  };

  if (connectedBanks.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Transações Bancárias</Title>
        </Header>
        <EmptyContainer>
          <EmptyText>
            Nenhum banco conectado.{'\n'}
            Conecte um banco para ver suas transações.
          </EmptyText>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Transações Bancárias</Title>
        <SyncButton onPress={handleSync} disabled={syncing}>
          <SyncButtonText>
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </SyncButtonText>
        </SyncButton>
      </Header>

      <BankFilter
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filterData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FilterButton
            onPress={() =>
              setSelectedBankId(item.id === 'all' ? null : item.id)
            }
            isActive={selectedBankId === null ? item.id === 'all' : item.id === selectedBankId}
          >
            <FilterButtonText isActive={selectedBankId === null ? item.id === 'all' : item.id === selectedBankId}>
              {item.name}
            </FilterButtonText>
          </FilterButton>
        )}
      />

      {syncing && !refreshing ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : filteredTransactions.length === 0 ? (
        <EmptyContainer>
          <EmptyText>
            {selectedBankId
              ? 'Nenhuma transação encontrada para este banco.'
              : 'Nenhuma transação encontrada.'}
          </EmptyText>
        </EmptyContainer>
      ) : (
        <TransactionsList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionCard
              data={formatTransaction(item)}
              onDelete={() => {}}
              onEdit={() => {}}
              showBankName
              bankName={item.bankName}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </Container>
  );
}

