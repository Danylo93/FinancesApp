import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { PieChart } from 'react-native-svg-charts';

interface PieChartWithLabelsProps {
  data: {
    value: number;
    color: string;
    key: string;
    totalFormatted: string;
    percent: string;
  }[];
}

const PieChartWithLabels: React.FC<PieChartWithLabelsProps> = ({ data }) => {
  const pieData = data.map(slice => ({
    value: slice.value,
    svg: { fill: slice.color },
    key: slice.key,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        style={styles.pieChart}
        data={pieData}
        innerRadius={0}
        outerRadius={'80%'}
        padAngle={0.02}
        animate
      />
      <View style={styles.legendContainer}>
        {data.map(item => (
          <View key={item.key} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    height: 180,
    width: 180,
  },
  legendContainer: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: RFValue(14),
  },
});

export default PieChartWithLabels;
