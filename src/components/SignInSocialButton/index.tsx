import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacityProps } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  Button,
  ImageContainer,
  Text,
} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  svg?: React.FC<SvgProps>;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export function SignInSocialButton({
  title,
  iconName,
  svg: Svg,
  ...rest
}: Props) {
  return (
    <Button {...rest}>
      <ImageContainer>
        <MaterialCommunityIcons name={iconName} size={24} color="black" />
      </ImageContainer>
      <Text>{title}</Text>
    </Button>
  );
}
