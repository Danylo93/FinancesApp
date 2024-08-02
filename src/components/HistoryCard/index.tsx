import React from 'react';

import {
  Container,
  Title,
  Amount,
} from './styles';

interface Props {
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({
  title,
  amount,
  color
}: Props) {
  // Verifique se o amount está formatado corretamente
  return(
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}
