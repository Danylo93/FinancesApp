import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Button = styled(TouchableOpacity)`
  height: ${RFValue(56)}px;
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: ${RFValue(5)}px;
  align-items: center;
  flex-direction: row;
  margin-bottom: ${RFValue(16)}px;
  elevation: 3; 
`;

export const ImageContainer = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: ${RFValue(16)}px;
  border-color: ${({ theme }) => theme.colors.background};
  border-right-width: 1px;
  border-right-color: ${({ theme }) => theme.colors.border}; 
`;

export const Text = styled.Text`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.text}; 
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  padding: ${RFValue(0)}px ${RFValue(16)}px; 
`;
