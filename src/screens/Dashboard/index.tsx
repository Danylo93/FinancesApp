import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  LoadContainer,
  LogoutButton,
} from './styles';
import AuthContext from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  const { logoutUser, user } = useContext(AuthContext);

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const collectionFilttered = collection
      .filter(transaction => transaction.type === type);

    if (collectionFilttered.length === 0)
      return "0";

    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFilttered
        .map(transaction => new Date(transaction.date).getTime())));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  async function loadTransactions() {
    try {
      const dataKey = `@gofinances:transactions_user:${user?.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensiveTotal = 0;

      const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

          if (item.type === 'positive') {
            entriesTotal += Number(item.amount);
          } else {
            expensiveTotal += Number(item.amount);
          }

          const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

          const date = Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          }).format(new Date(item.date));

          return {
            id: item.id,
            name: item.name,
            amount,
            type: item.type,
            category: item.category,
            date,
          }

        });

      setTransactions(transactionsFormatted);

      const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
      const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');

      const totalInterval = lastTransactionExpensives === "0"
        ? 'Não há Transações'
        : `01 a ${lastTransactionExpensives}`;

      const total = entriesTotal - expensiveTotal;

      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastTransactionEntries === "0" ? 'Não Há Transações'
            : `Última entrada dia ${lastTransactionEntries}`,
        },
        expensives: {
          amount: expensiveTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastTransactionExpensives === "0" ? 'Não há Transações'
            : `Última saída dia ${lastTransactionExpensives}`,
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: totalInterval
        }
      });

    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Stop refreshing
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      const dataKey = `@gofinances:transactions_user:${user?.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      const updatedTransactions = transactions.filter((transaction: DataListProps) => transaction.id !== id);

      await AsyncStorage.setItem(dataKey, JSON.stringify(updatedTransactions));

      loadTransactions();

    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert("Erro", "Não foi possível excluir a transação.");
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  function handleSignOut() {
    Alert.alert(
      "Confirmar Logout",
      "Você tem certeza que deseja deslogar?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: () => logoutUser()
        }
      ]
    );
  }

  // Refresh control handler
  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{ uri: user?.imageUrl || 'https://picsum.photos/120' }}
                  />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>{user?.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={handleSignOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>

            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlightData.entries.amount}
                lastTransaction={highlightData.entries.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlightData.expensives.amount}
                lastTransaction={highlightData.expensives.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.total.amount}
                lastTransaction={highlightData.total.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Histórico de Transações</Title>

              <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TransactionCard
                    data={item}
                    onDelete={() => {
                      Alert.alert(
                        "Confirmar Exclusão",
                        "Você tem certeza que deseja excluir esta transação?",
                        [
                          {
                            text: "Cancelar",
                            style: "cancel"
                          },
                          {
                            text: "Excluir",
                            onPress: () => handleDeleteTransaction(item.id)
                          }
                        ]
                      );
                    }}
                  />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.colors.primary]} // Customize the refresh control color
                  />
                }
              />
            </Transactions>
          </>
      }
    </Container>
  );
}
