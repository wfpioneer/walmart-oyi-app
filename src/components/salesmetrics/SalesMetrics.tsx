import React, { useState } from 'react';
import { Text, View } from 'react-native';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import Button from '../button/Button';
import moment from 'moment';
import ItemDetails from '../../models/ItemDetails';
import styles from './SalesMetrics.styles';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg'
import * as scale from 'd3-scale'

// Could possibly be combined with below, but the input keys are different
const renderDailyList = (dailyList: [{day: string, value: number}]) => {
  return (
    <View style={styles.listContainer}>
      {dailyList.map((row, index) => {
        const formattedDay = moment(row.day).format('ddd, MMM DD');
        return (
          <View key={index} style={[styles.listRowContainer, {borderTopWidth: index !==0 ? 1 : 0}]} >
            <Text>{formattedDay}</Text>
            <Text>{row.value}</Text>
          </View>
        )
      })}
    </View>
  )
}

// Could possibly be combined with above, but the input keys are different
const renderWeeklyList = (weeklyList: [{week: number, value: number}]) => {
  return (
    <View style={styles.listContainer}>
      {weeklyList.map((row, index) => {
        return (
          <View key={index} style={[styles.listRowContainer, {borderTopWidth: index !==0 ? 1 : 0}]} >
            <Text>{`${strings('GENERICS.WEEK')} ${row.week}`}</Text>
            <Text>{row.value}</Text>
          </View>
        )
      })}
    </View>
  )
}

const SalesMetrics = (props: {itemDetails: ItemDetails, isGraphView: boolean}) => {
  const [isDailyPeriod, setIsDailyPeriod] = useState(true);
  const { daily, weekly, dailyAvgSales, weeklyAvgSales } = props.itemDetails.sales;

  const salesTimePeriodText = isDailyPeriod ? strings('GENERICS.DAILY') : strings('GENERICS.WEEKLY');
  const dailyChartData = daily.map((data) => {
    return {
      label: data.day,
      value: data.value
    };
  });
  const weeklyChartData = weekly.map((data) => {
    return {
      label: data.week,
      value: data.value
    };
  });

  const handleDailyTimePeriodChange = (isDaily: boolean) => () => {
    setIsDailyPeriod(isDaily);
  }

  return (
    <View>
      <View style={styles.averageContainer}>
        <Text style={styles.averageQtyNbr}>{isDailyPeriod ? dailyAvgSales : weeklyAvgSales}</Text>
        <Text style={styles.averageQtyLabel}>{`${salesTimePeriodText} ${strings('ITEM.AVG_SALES')}`}</Text>
      </View>
      {isDailyPeriod && !props.isGraphView ?
        renderDailyList(daily)
        :
        <View style={{height: 200, paddingVertical: 16}} >
          <BarChart
            style={{ flex: 1 }}
            data={dailyChartData}
            yAccessor={({item}) => item.value}
            svg={{ fill: 'rgba(12, 150, 12, 0.95)' }}
            contentInset={{ top: 10, bottom: 10 }}
            gridMin={0}
          >
            <Grid />
          </BarChart>
          <XAxis
            style={{ marginTop: 10 }}
            data={ dailyChartData }
            scale={scale.scaleBand}
            formatLabel={ (value, index) => moment(dailyChartData[index].label).format('MM-DD') }
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
      }
      {!isDailyPeriod && !props.isGraphView ?
        renderWeeklyList(weekly)
        :
        <View>
          {/*<BarChart data={weeklyChartData}>*/}
          {/*  <Grid />*/}
          {/*</BarChart>*/}
        </View>
      }
      <View style={styles.bottomButtonContainer} >
        <Button
          title={strings('GENERICS.DAILY')}
          titleFontSize={12}
          titleFontWeight={'bold'}
          titleColor={!isDailyPeriod ? COLOR.MAIN_THEME_COLOR : COLOR.WHITE}
          backgroundColor={!isDailyPeriod ? COLOR.GREY_200 : COLOR.MAIN_THEME_COLOR}
          height={20}
          width={72}
          radius={50}
          style={{marginRight: 4}}
          onPress={handleDailyTimePeriodChange(true)}
        />
        <Button
          title={strings('GENERICS.WEEKLY')}
          titleFontSize={12}
          titleFontWeight={'bold'}
          titleColor={isDailyPeriod ? COLOR.MAIN_THEME_COLOR : COLOR.WHITE}
          backgroundColor={isDailyPeriod ? COLOR.GREY_200 : COLOR.MAIN_THEME_COLOR}
          height={20}
          width={72}
          radius={50}
          style={{marginLeft: 4}}
          onPress={handleDailyTimePeriodChange(false)}
        />
      </View>
    </View>
  )
}

export default SalesMetrics;
