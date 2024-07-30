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
  DeleteButton, // Importa o componente de botão de exclusão
  DeleteIcon // Importa o ícone para o botão de exclusão
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
  onDelete: () => void; // Adiciona a prop para exclusão
}

export function TransactionCard({ data, onDelete }: Props) {
  const [category] = categories.filter(
    item => item.key === data.category
  );

  return (
    <Container>
      <Title>
        {data.name}
      </Title>

      <TouchableOpacity onPress={onDelete}>
        <DeleteButton>
          <DeleteIcon name="trash" />
        </DeleteButton>
      </TouchableOpacity>

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

      
    </Container>
  );
}
