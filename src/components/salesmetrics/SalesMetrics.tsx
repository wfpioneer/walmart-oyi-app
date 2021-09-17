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
import styles from './SalesMetrics.style';
import { trackEvent } from '../../utils/AppCenterTool';
import ItemDetailsList, { ItemDetailsListRow } from '../ItemDetailsList/ItemDetailsList';

// Could possibly be combined with below, but the input keys are different
const renderDailyList = (dailyList: {day: string; value: number}[]) => {
  const rows: ItemDetailsListRow[] = dailyList.map(row => {
    const formattedDay = moment(row.day).format('ddd, MMM DD');
    return { label: formattedDay, value: row.value };
  });

  return <ItemDetailsList rows={rows} />;
};

// Could possibly be combined with above, but the input keys are different
const renderWeeklyList = (weeklyList: {week: number; value: number}[]) => {
  const rows: ItemDetailsListRow[] = weeklyList.map(row => ({
    label: `${strings('GENERICS.WEEK')} ${row.week}`,
    value: row.value
  }));
  return <ItemDetailsList rows={rows} />;
};

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
    <View style={styles.chartContainer}>
      <BarChart
        style={styles.barChartSize}
        data={chartData}
        yAccessor={({ item }) => item.value}
        svg={{ fill: COLOR.GREEN }}
        contentInset={{ top: 20, bottom: 10 }}
        gridMin={0}
      >
        <Grid />
        {/* @ts-expect-error because props are passed in from BarChart */}
        <Labels />
      </BarChart>
      <XAxis
        style={styles.axisPosition}
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
          style={styles.dailyButton}
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
          style={styles.weeklyButton}
          onPress={handleDailyTimePeriodChange(false)}
        />
      </View>
      <View style={styles.averageContainer}>
        <Text style={styles.averageQtyNbr}>{isDailyPeriod ? dailyAvgSales : weeklyAvgSales}</Text>
        <Text style={styles.averageQtyLabel}>
          {isDailyPeriod
            ? `${salesTimePeriodText} ${strings('ITEM.AVG_SALES')}`
            : `${strings('ITEM.WEEKLY_AVG_SALES')}`}
        </Text>
      </View>
      {isDailyPeriod && !props.isGraphView && renderDailyList(daily)}
      {isDailyPeriod && props.isGraphView && renderChart(dailyChartData, isDailyPeriod)}
      {!isDailyPeriod && !props.isGraphView && renderWeeklyList(weekly)}
      {!isDailyPeriod && props.isGraphView && renderChart(weeklyChartData, isDailyPeriod)}
    </View>
  );
};

export default SalesMetrics;
