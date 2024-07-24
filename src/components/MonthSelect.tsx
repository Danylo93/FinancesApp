import React, { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'styled-components';

interface MonthSelectProps {
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const months = Array.from({ length: 12 }, (_, i) => new Date(2020, i).toLocaleString('default', { month: 'long' }));

const MonthSelect: React.FC<MonthSelectProps> = ({ selectedMonth, onMonthChange }) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Obtém o mês atual
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    if (scrollViewRef.current) {
      // Calcular a posição do mês selecionado para centralizar
      const monthWidth = 120; // Largura média do botão em pixels (ajuste conforme necessário)
      const offset = monthWidth * selectedMonth - (Dimensions.get('window').width / 2 - monthWidth / 2);

      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [selectedMonth]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {months.map((month, index) => (
        <TouchableOpacity
          key={month}
          onPress={() => index <= currentMonth && onMonthChange(index)} // Permite a seleção apenas para meses não futuros
          style={[
            styles.button,
            {
              backgroundColor: selectedMonth === index ? theme.colors.primary : theme.colors.background,
              opacity: index > currentMonth ? 0.5 : 1, // Aplica opacidade para meses futuros
            },
          ]}
          disabled={index > currentMonth} // Desativa o botão para meses futuros
        >
          <Text style={{ color: selectedMonth === index ? theme.colors.background : theme.colors.text }}>
            {month}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  button: {
    width: 100, // Defina uma largura consistente para os botões
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MonthSelect;
