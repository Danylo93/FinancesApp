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
import { format, parseISO, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TextInputMask } from 'react-native-masked-text'; // Importa o componente para máscara

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
    .string()
    .required('O valor é obrigatório')
    .test('is-valid-amount', 'Informe um valor válido', (value) => {
      // Verifica se o valor corresponde ao formato monetário esperado
      return /^(\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value);
    }),
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
  } = useForm<FormData>({
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
      if (isFuture(date)) {
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

    // Substitua vírgula por ponto no valor
    const formattedAmount = form.amount.replace(',', '.');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: formattedAmount, // Use o valor formatado
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

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputMask
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: '',
                    suffixUnit: ''
                  }}
                  placeholder="Preço"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  style={{ ...styles.input, marginBottom: 10 }}
                />
              )}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

            <Text>Selecione a Data da Transação</Text>
            <DateButton onPress={handleOpenDatePicker}>
              <Text>{format(selectedDate, 'dd MMMM yyyy', { locale: ptBR })}</Text>
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

const styles = {
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
};
