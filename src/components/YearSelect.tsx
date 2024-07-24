// YearSelect.tsx
import React, { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'styled-components';

interface YearSelectProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

const YearSelect: React.FC<YearSelectProps> = ({ selectedYear, onYearChange }) => {
  const theme = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      const yearWidth = 100; // Largura média do botão em pixels (ajuste conforme necessário)
      const totalWidth = years.length * (yearWidth + 10); // Largura total dos anos
      const offset = yearWidth * years.indexOf(selectedYear) - (Dimensions.get('window').width / 2 - yearWidth / 2);
      const maxOffset = Math.max(0, totalWidth - Dimensions.get('window').width); // Limita o deslocamento máximo

      scrollViewRef.current.scrollTo({ x: Math.min(Math.max(offset, 0), maxOffset), animated: true });
    }
  }, [selectedYear]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {years.map(year => (
        <TouchableOpacity
          key={year}
          onPress={() => onYearChange(year)}
          style={[
            styles.button,
            {
              backgroundColor: selectedYear === year ? theme.colors.primary : theme.colors.background,
            },
          ]}
        >
          <Text style={{ color: selectedYear === year ? theme.colors.background : theme.colors.text }}>
            {year}
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

export default YearSelect;
