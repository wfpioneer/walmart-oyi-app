import React, { useState } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import { scaleBand } from 'd3-scale';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import Button from '../buttons/Button';
import ItemDetails from '../../models/ItemDetails';
import styles from './SalesMetrics.styles';
import { trackEvent } from '../../utils/AppCenterTool';

// Could possibly be combined with below, but the input keys are different
const renderDailyList = (dailyList: [{day: string; value: number}]) => (
  <View style={styles.listContainer}>
    {dailyList.map((row, index) => {
      const formattedDay = moment(row.day).format('ddd, MMM DD');
      return (
        // eslint-disable-next-line react/no-array-index-key
        <View key={index} style={[styles.listRowContainer, { borderTopWidth: index !== 0 ? 1 : 0 }]}>
          <Text>{formattedDay}</Text>
          <Text>{row.value}</Text>
        </View>
      );
    })}
  </View>
);

// Could possibly be combined with above, but the input keys are different
const renderWeeklyList = (weeklyList: [{week: number; value: number}]) => (
  <View style={styles.listContainer}>
    {weeklyList.map((row, index) => (
      <View key={row.week} style={[styles.listRowContainer, { borderTopWidth: index !== 0 ? 1 : 0 }]}>
        <Text>{`${strings('GENERICS.WEEK')} ${row.week}`}</Text>
        <Text>{row.value}</Text>
      </View>
    ))}
  </View>
);

const renderChart = (chartData: {label: string; value: number}[], isDailyPeriod: boolean) => {
  const CUT_OFF = 50;
  const Labels = (props: { x: any; y: any; bandwidth: any; data: [{label: string; value: number}] }) => {
    const {
      x, y, bandwidth, data
    } = props;
    return (
      data.map((entry, index) => (
        <SvgText
          key={entry.label}
          x={x(index) + (bandwidth / 2)}
          y={entry.value < CUT_OFF ? y(entry.value) - 10 : y(entry.value) + 15}
          fontSize={10}
          fill={entry.value >= CUT_OFF ? 'white' : 'black'}
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {entry.value}
        </SvgText>
      ))
    );
  };

  const formatChartLabel = (label: string) => {
    if (isDailyPeriod) {
      return moment(label).format('MM-DD');
    }
    return `${strings('GENERICS.WEEK')} ${label}`;
  };

  return (
    <View style={{ height: 200, paddingVertical: 16 }}>
      <BarChart
        style={{ flex: 1 }}
        data={chartData}
        yAccessor={({ item }) => item.value}
        svg={{ fill: COLOR.GREEN }}
        contentInset={{ top: 20, bottom: 10 }}
        gridMin={0}
      >
        <Grid />
        {/* @ts-ignore because props are passed in from BarChart */}
        <Labels />
      </BarChart>
      <XAxis
        style={{ marginTop: 10 }}
        data={chartData}
        scale={scaleBand}
        formatLabel={(value, index) => formatChartLabel(chartData[index].label)}
        svg={{ fontSize: 10, fill: 'black' }}
      />
    </View>
  );
};

const SalesMetrics = (props: {itemDetails: ItemDetails; isGraphView: boolean}) => {
  const [isDailyPeriod, setIsDailyPeriod] = useState(true);
  const {
    daily, weekly, dailyAvgSales, weeklyAvgSales
  } = props.itemDetails.sales;

  const salesTimePeriodText = isDailyPeriod ? strings('GENERICS.DAILY') : strings('GENERICS.WEEKLY');
  const dailyChartData = daily.map(data => ({
    label: data.day,
    value: data.value
  }));
  const weeklyChartData = weekly.map(data => ({
    label: `${data.week}`,
    value: data.value
  }));

  const handleDailyTimePeriodChange = (isDaily: boolean) => () => {
    trackEvent('item_details_sales_metrics_change_period', { itemDetails: JSON.stringify(props.itemDetails), isDaily });
    setIsDailyPeriod(isDaily);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topButtonContainer}>
        <Button
          title={strings('GENERICS.DAILY')}
          titleFontSize={12}
          titleFontWeight="bold"
          titleColor={!isDailyPeriod ? COLOR.MAIN_THEME_COLOR : COLOR.WHITE}
          backgroundColor={!isDailyPeriod ? COLOR.GREY_200 : COLOR.MAIN_THEME_COLOR}
          height={20}
          width={72}
          radius={50}
          style={{ marginRight: 4 }}
          onPress={handleDailyTimePeriodChange(true)}
        />
        <Button
          title={strings('GENERICS.WEEKLY')}
          titleFontSize={12}
          titleFontWeight="bold"
          titleColor={isDailyPeriod ? COLOR.MAIN_THEME_COLOR : COLOR.WHITE}
          backgroundColor={isDailyPeriod ? COLOR.GREY_200 : COLOR.MAIN_THEME_COLOR}
          height={20}
          width={72}
          radius={50}
          style={{ marginLeft: 4 }}
          onPress={handleDailyTimePeriodChange(false)}
        />
      </View>
      <View style={styles.averageContainer}>
        <Text style={styles.averageQtyNbr}>{isDailyPeriod ? dailyAvgSales : weeklyAvgSales}</Text>
        <Text style={styles.averageQtyLabel}>{`${salesTimePeriodText} ${strings('ITEM.AVG_SALES')}`}</Text>
      </View>
      {isDailyPeriod && !props.isGraphView && renderDailyList(daily)}
      {isDailyPeriod && props.isGraphView && renderChart(dailyChartData, isDailyPeriod)}
      {!isDailyPeriod && !props.isGraphView && renderWeeklyList(weekly)}
      {!isDailyPeriod && props.isGraphView && renderChart(weeklyChartData, isDailyPeriod)}
    </View>
  );
};

export default SalesMetrics;
