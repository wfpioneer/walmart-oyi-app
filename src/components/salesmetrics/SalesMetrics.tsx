import React, { useState } from 'react';
import { Text, View } from 'react-native';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import Button from '../button/Button';
import moment from 'moment';
import ItemDetails from '../../models/ItemDetails';
import styles from './SalesMetrics.styles';

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

const SalesMetrics = (props: {itemDetails: ItemDetails}) => {
  const [isDailyPeriod, setIsDailyPeriod] = useState(true);
  const { daily, weekly, dailyAvgSales, weeklyAvgSales } = props.itemDetails.sales;

  const salesTimePeriodText = isDailyPeriod ? strings('GENERICS.DAILY') : strings('GENERICS.WEEKLY');

  const handleDailyTimePeriodChange = (isDaily: boolean) => () => {
    setIsDailyPeriod(isDaily);
  }

  return (
    <View>
      <View style={styles.averageContainer}>
        <Text style={styles.averageQtyNbr}>{isDailyPeriod ? dailyAvgSales : weeklyAvgSales}</Text>
        <Text style={styles.averageQtyLabel}>{`${salesTimePeriodText} ${strings('ITEM.AVG_SALES')}`}</Text>
      </View>
      {isDailyPeriod && renderDailyList(daily)}
      {!isDailyPeriod && renderWeeklyList(weekly)}
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
