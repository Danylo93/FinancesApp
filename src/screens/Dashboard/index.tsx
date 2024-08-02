import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Modal, TextInput, Button, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { TextInputMask } from 'react-native-masked-text'; // Importa o componente para máscara

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
  ModalContainer,
  ModalBackground,
  ModalContent,
  ModalTitle,
} from './styles'; // Certifique-se de importar os novos estilos
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
  const [editingTransaction, setEditingTransaction] = useState<DataListProps | null>(null); // Adiciona o estado para a transação sendo editada
  const [modalVisible, setModalVisible] = useState(false); // Adiciona o estado para a visibilidade do modal
  const [newAmount, setNewAmount] = useState(''); // Adiciona o estado para o novo valor

  const theme = useTheme();
  const { logoutUser, user } = useContext(AuthContext);

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const collectionFiltered = collection.filter(transaction => transaction.type === type);

    if (collectionFiltered.length === 0) return "0";

    const lastTransactionDate = Math.max(...collectionFiltered.map(transaction => new Date(transaction.date).getTime()));
    const lastTransaction = new Date(lastTransactionDate);

    return format(lastTransaction, "dd 'de' MMMM", { locale: ptBR });
  }

  async function loadTransactions() {
    try {
      const dataKey = `@gofinances:transactions_user:${user?.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensiveTotal = 0;

      const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date = format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR });

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
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

  async function handleEditTransaction() {
    if (editingTransaction) {
      try {
        const dataKey = `@gofinances:transactions_user:${user?.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        const updatedTransactions = transactions.map((transaction: DataListProps) => {
          if (transaction.id === editingTransaction.id) {
            // Remove a formatação de moeda para converter para número
            const amount = parseFloat(newAmount.replace(/[^\d.,-]/g, '').replace(',', '.'));
            return { ...transaction, amount: amount.toString() };
          }
          return transaction;
        });

        await AsyncStorage.setItem(dataKey, JSON.stringify(updatedTransactions));

        loadTransactions();
        setModalVisible(false);
      } catch (error) {
        console.error('Error editing transaction:', error);
        Alert.alert("Erro", "Não foi possível editar a transação.");
      }
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

  const onEdit = (transaction: DataListProps) => {
    setEditingTransaction(transaction);
    setNewAmount(transaction.amount); // Preenche o valor atual no estado
    setModalVisible(true);
  };

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: user?.photo }} />
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

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
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
                  onEdit={() => onEdit(item)} // Adiciona a funcionalidade de edição
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadTransactions()}
                />
              }
            />
          </Transactions>
        </>
      )}

      {/* Modal de edição */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalBackground>
          <ModalContainer>
            <ModalContent>
              <ModalTitle>Editar Valor da Transação</ModalTitle>
              <TextInputMask
                type={'money'}
                value={newAmount}
                onChangeText={setNewAmount}
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  marginBottom: 20,
                  fontSize: 18,
                }}
                placeholder="Novo valor"
              />
              <Button title="Salvar" onPress={handleEditTransaction} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#f00" />
            </ModalContent>
          </ModalContainer>
        </ModalBackground>
      </Modal>
    </Container>
  );
}
