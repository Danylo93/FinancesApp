import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};

  width: 100%;
  height: ${RFValue(113)}px;

  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const Form = styled.View`
  flex: 1;
  justify-content: space-between;
  width: 100%;

  padding: 24px;
`;

export const Fields = styled.View``;

export const TransactionsTypes = styled.View`
  flex-direction: row;
  justify-content: space-between;

  margin-top: 8px;
  margin-bottom: 16px;
`;

export const DateButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;

export const DateText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text_dark};
`;