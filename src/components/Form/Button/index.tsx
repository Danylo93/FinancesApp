import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Title } from './styles';

interface Props extends TouchableOpacityProps { // Atualize o tipo de props
  title: string;
  onPress: () => void;
}

export function Button({
  title,
  onPress,
  ...rest
}: Props) {
  return (
    <Container onPress={onPress} {...rest}>
      <Title>
        { title }
      </Title>
    </Container>
  );
}
