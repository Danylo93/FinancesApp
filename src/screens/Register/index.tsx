import React, { useContext, useState } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  View,
  Text
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
  DateButton,
} from './styles';
import AuthContext from '../../hooks/auth';

interface FormData {
  name: string;
  amount: string;
  date: Date;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: selectedDate,
    }
  });

  function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenDatePicker() {
    setDatePickerVisible(true);
  }

  function handleDateChange(event: any, date?: Date) {
    setDatePickerVisible(false);
    if (date) {
      const currentDate = new Date();
      if (date > currentDate) {
        Alert.alert('Data inválida', 'Não é permitido selecionar uma data futura.');
        return;
      }
      setSelectedDate(date);
    }
  }

  async function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert('Selecione o tipo da transação');

    if (category.key === 'category')
      return Alert.alert('Selecione a categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: selectedDate.toISOString()
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user?.id}`;

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });
      setSelectedDate(new Date());

      navigation.navigate('Dashboard');

    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <Text>Selecione a Data da Transação</Text>
            <DateButton onPress={handleOpenDatePicker}>
              <Text>{selectedDate.toLocaleDateString('pt-BR')}</Text>
            </DateButton>

            {datePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()} // Impede a seleção de datas futuras
              />
            )}

            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Receita"
                onPress={() => handleTransactionsTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type="down"
                title="Despesa"
                onPress={() => handleTransactionsTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
