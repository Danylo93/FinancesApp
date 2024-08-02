import React from 'react';
import { TouchableOpacity } from 'react-native'; // Importa o TouchableOpacity
import { categories } from '../../utils/categories';

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
  DeleteButton,
  DeleteIcon,
  EditButton, // Importa o componente de botão de edição
  EditIcon // Importa o ícone para o botão de edição
} from './styles';

export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
  onDelete: () => void;
  onEdit: () => void; // Adiciona a prop para edição
}

export function TransactionCard({ data, onDelete, onEdit }: Props) {
  const [category] = categories.filter(
    item => item.key === data.category
  );

  return (
    <Container>
      <Title>
        {data.name}
      </Title>

      <Amount type={data.type}>
        {data.type === 'negative' && '- '}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>
            {category.name}
          </CategoryName>
        </Category>

        <Date>
          {data.date}
        </Date>
      </Footer>

      <EditButton onPress={onEdit}>
        <EditIcon name="open" /> 
      </EditButton>

      <DeleteButton onPress={onDelete}>
        <DeleteIcon name="trash" /> 
      </DeleteButton>
    </Container>
  )
}
