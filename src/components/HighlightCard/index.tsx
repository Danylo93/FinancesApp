import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from './styles';

interface Props {
  type: 'up' | 'down' | 'total';
  title: string;
  amount: string;
  lastTransaction: string;
  isNegative?: boolean;
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign'
}

export function HighlightCard({
  type,
  title,
  amount,
  lastTransaction,
  isNegative = false
}: Props) {
  // Formata o amount com base no valor recebido
  const formattedAmount = isNegative ? `-${amount}` : amount;

  return (
    <Container type={type} isNegative={isNegative}>
      <Header>
        <Title type={type}>
          {title}
        </Title>
        <Icon
          name={icon[type]}
          type={type}
        />
      </Header>

      <Footer>
        <Amount type={type}>
          {formattedAmount}
        </Amount>
        <LastTransaction type={type}>
          {lastTransaction}
        </LastTransaction>
      </Footer>
    </Container>
  )
}
