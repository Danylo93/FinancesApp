import React, { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Dimensions, View, Text , StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { RFValue } from 'react-native-responsive-fontsize';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native'; 
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { HistoryCard } from '../../components/HistoryCard';
import MonthSelect from '../../components/MonthSelect';  
import YearSelect from '../../components/YearSelect';    

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  LoadContainer
} from './styles';

import { categories } from '../../utils/categories';
import AuthContext from '../../hooks/auth';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;  
}

interface CategoryData {
  key: string;
  name: string;
  total?: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

const screenWidth = Dimensions.get('window').width;

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user?.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const startOfSelectedMonth = startOfMonth(new Date(selectedYear, selectedMonth, 1));
    const endOfSelectedMonth = endOfMonth(new Date(selectedYear, selectedMonth, 1));

    const expensives = responseFormatted
      .filter((expensive: TransactionData) =>
        expensive.type === 'negative' &&
        new Date(expensive.date) >= startOfSelectedMonth &&
        new Date(expensive.date) <= endOfSelectedMonth
      );

    const expensivesTotal = expensives
      .reduce((acumullator: number, expensive: TransactionData) => {
        return acumullator + Number(expensive.amount);
      }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedMonth, selectedYear]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <View style={{ marginVertical: 20 }}>
              <Text>Selecione o ano:</Text>
              <YearSelect
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text>Selecione o mês:</Text>
              <MonthSelect
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </View>

            {
              totalByCategories.length > 0 ? (
                <>
                  <ChartContainer>
                    <PieChart
                      data={totalByCategories.map(category => ({
                        name: category.name,
                        population: category.total,
                        color: category.color,
                        legendFontColor: theme.colors.text,
                        legendFontSize: RFValue(15),
                      }))}
                      width={screenWidth - 48}
                      height={220}
                      chartConfig={{
                        backgroundColor: theme.colors.background,
                        backgroundGradientFrom: theme.colors.background,
                        backgroundGradientTo: theme.colors.background,
                        color: (opacity = 1) => theme.colors.primary,
                        labelColor: (opacity = 1) => theme.colors.text,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </ChartContainer>

                  {
                    totalByCategories.map(item => (
                      <HistoryCard
                        key={item.key}
                        title={item.name}
                        amount={item.totalFormatted}
                        color={item.color}
                      />
                    ))
                  }
                </>
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Você não fez nenhuma transação nesse mês.</Text>
                </View>
              )
            }
          </Content>
      }
    </Container>
  );
}

const styles = StyleSheet.create({
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  noDataText: {
    fontSize: RFValue(14),
    color: '#999',
  },
});
