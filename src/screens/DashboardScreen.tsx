// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const data = [
  { name: 'Alimentação', amount: 50, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Transporte', amount: 30, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Lazer', amount: 20, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 }
];

export default function DashboardScreen() {
return (
<View style={styles.container}>
<Text style={styles.title}>Dashboard</Text>
<PieChart
data={data}
width={400}
height={220}
chartConfig={{
backgroundGradientFrom: '#fff',
backgroundGradientTo: '#fff',
color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
}}
accessor="amount"
backgroundColor="transparent"
paddingLeft="15"
absolute
/>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
title: {
fontSize: 24,
marginBottom: 20,
},
});
