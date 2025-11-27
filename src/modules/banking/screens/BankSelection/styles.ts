import styled from 'styled-components/native';
import { FlatList } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  padding: 20px;
  padding-top: 60px;
  background-color: ${({ theme }) => theme.colors.shape};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.title};
`;

export const BankList = styled(FlatList)`
  flex: 1;
  padding: 20px;
` as typeof FlatList;

export const BankCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left-width: 4px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

export const BankLogo = styled.Text`
  font-size: 40px;
  margin-right: 16px;
`;

export const BankInfo = styled.View`
  flex: 1;
`;

export const BankName = styled.Text`
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.title};
  margin-bottom: 4px;
`;

export const BankStatus = styled.View<{ isConnected: boolean }>`
  margin-top: 4px;
`;

export const StatusText = styled.Text<{ isConnected: boolean }>`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme, isConnected }) =>
    isConnected ? theme.colors.success : theme.colors.text};
`;

export const ConnectButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 12px 20px;
  border-radius: 8px;
`;

export const DisconnectButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.attention};
  padding: 12px 20px;
  border-radius: 8px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 14px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ActivityIndicator = styled.ActivityIndicator``;

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
`;

