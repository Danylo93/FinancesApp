import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

interface TransactionProps {
  type: 'positive' | 'negative';
}

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
  padding: 17px 24px;
  margin-bottom: 16px;
  position: relative; /* Adicionado para permitir posicionamento absoluto dos botões */
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;

export const Amount = styled.Text<TransactionProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(20)}px;
  color: ${({ theme, type }) =>
    type === 'positive' ? theme.colors.success : theme.colors.attention};
  margin-top: 2px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 19px;
`;

export const Category = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const CategoryName = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 17px;
`;

export const Date = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 10px;
  background: ${({ theme }) => theme.colors.background};
  padding: 10px;
  border-radius: 50px;
`;

export const DeleteIcon = styled(Ionicons)`
  color: ${({ theme }) => theme.colors.danger};
`;

export const EditButton = styled.TouchableOpacity`
  position: absolute;
  right: 50px; /* Ajusta para ficar na mesma linha que o botão de deletar */
  top: 10px;
  background: ${({ theme }) => theme.colors.background};
  padding: 10px;
  border-radius: 50px;
`;

export const EditIcon = styled(Ionicons)`
  color: ${({ theme }) => theme.colors.danger};
`;
