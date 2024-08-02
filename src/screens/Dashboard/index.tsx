import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl,TouchableOpacity, Modal, TextInput, Button, View, Text, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { TextInputMask } from 'react-native-masked-text'; // Importa o componente para máscara
import { MaterialIcons } from '@expo/vector-icons'; // Importa o ícone

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  HighlightCardTotal,
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
import { useNavigation } from '@react-navigation/native';
import { Register } from '../Register';

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
  const [registerModalVisible, setRegisterModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [refreshing, setRefreshing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<DataListProps | null>(null); // Adiciona o estado para a transação sendo editada
  const [modalVisible, setModalVisible] = useState(false); // Adiciona o estado para a visibilidade do modal
  const [newAmount, setNewAmount] = useState(''); // Adiciona o estado para o novo valor
  const [newName, setNewName] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();
  const { logoutUser, user } = useContext(AuthContext);
  const { width } = Dimensions.get('window'); // Obtenha a largura da tela
  const highlightCardWidth = width * 0.8;


  const handleOpenRegisterModal = () => {
    setRegisterModalVisible(true);
  };

  const handleCloseRegisterModal = () => {
    setRegisterModalVisible(false);
  };

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
  
        // Remove a formatação de moeda para converter para número
        const cleanAmount = newAmount.replace(/[^\d.,-]/g, '').replace(',', '.');
        const amount = parseFloat(cleanAmount);
  
        const updatedTransactions = transactions.map((transaction: DataListProps) => {
          if (transaction.id === editingTransaction.id) {
            return { ...transaction, amount: amount.toString(), name: newName };
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
    setNewName(transaction.name);
    setNewAmount(transaction.amount); // Preenche o valor atual no estado
    setModalVisible(true);
  };

  function handleAddTransaction(){
    navigation.navigate('Cadastrar')
  }

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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={highlightCardWidth} // Define o intervalo de snap
            decelerationRate="fast" // Ajusta a velocidade de desaceleração
          >
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
              style={{ width: highlightCardWidth }} // Define a largura do card
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
              type="down"
              style={{ width: highlightCardWidth }} // Define a largura do card
            />
            <HighlightCardTotal style={{ width: highlightCardWidth }}>
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
              isNegative={Number(highlightData.total.amount.replace(/[^\d.-]/g, '')) < 0}
              style={{ width: highlightCardWidth }} // Define a largura do card
            />
            </HighlightCardTotal>
          </ScrollView>
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
                  onRefresh={loadTransactions}
                />
              }
            />
          </Transactions>
        </>
      )}

      {/* Modal para edição de transações */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <ModalContainer>
          <ModalBackground >
          <ModalContent>
            <ModalTitle>Editar Transação</ModalTitle>
            <TextInput
              placeholder="Nome"
              value={newName}
              onChangeText={setNewName}
              style={{ marginBottom: 15, borderBottomWidth: 1, borderColor: '#ccc', padding: 10 }}
            />
            <TextInputMask
              type={'money'}
              value={newAmount}
              onChangeText={setNewAmount}
              placeholder="Valor"
              style={{ marginBottom: 15, borderBottomWidth: 1, borderColor: '#ccc', padding: 10 }}
            />
            <Button
              title="Salvar"
              onPress={handleEditTransaction}
            />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="#ff6f61"
            />
          </ModalContent>
          </ModalBackground>
        </ModalContainer>
      </Modal>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: theme.colors.primary,
          borderRadius: 50,
          padding: 15,
          elevation: 10,
        }}
        onPress={handleOpenRegisterModal}
      >
        <MaterialIcons name="add" size={15} color="#fff" />
      </TouchableOpacity>
      <Register visible={registerModalVisible} onClose={handleCloseRegisterModal} />

    </Container>
  );
}
