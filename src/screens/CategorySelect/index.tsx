import React from 'react';
import { Button } from '../../components/Form/Button';
import { categories } from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
  CloseButton,  // Adicionando importação do CloseButton
} from './styles';
import { Feather } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import theme from '../../global/styles/theme';

interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}: Props) {

  function handleCategorySelect(category: Category) {
    setCategory(category);
  }

  return (
    <Container>
      <Header>
        <CloseButton onPress={closeSelectCategory}>
        <Feather name="x" size={24} color={theme.colors.text} />
        </CloseButton>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button
          title="Selecionar"
          onPress={closeSelectCategory}
        />
      </Footer>
    </Container>
  );
}
