import styled from 'styled-components/native';
import { FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 60px;
  background-color: ${({ theme }) => theme.colors.shape};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.title};
  flex: 1;
`;

export const SyncButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.text : theme.colors.primary};
  padding: 10px 16px;
  border-radius: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const SyncButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 14px;
`;

export const BankFilter = styled(FlatList)`
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.colors.shape};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background};
` as typeof FlatList;

export const FilterButton = styled.TouchableOpacity<{ isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: 8px;
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.background};
`;

export const FilterButtonText = styled.Text<{ isActive: boolean }>`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.shape : theme.colors.text};
`;

export const TransactionsList = styled(FlatList)`
  flex: 1;
  padding: 20px;
` as typeof FlatList;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 24px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ActivityIndicator = styled.ActivityIndicator``;

