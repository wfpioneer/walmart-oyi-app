import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import { PrintPriceSignStackParamList } from '../../navigators/PrintPriceSignNavigator';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';

type PrintPriceSignScreenRouteParam = RouteProp<PrintPriceSignStackParamList, 'PrintPriceSign'>

const PrintPriceSign = () => {
  const { itemName, itemNbr, upcNbr, category } = useRoute<PrintPriceSignScreenRouteParam>().params;

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Image source={{}} />
          <Text></Text>
        </View>
        <View>
          <Text></Text>
          <View>
            <IconButton />
            <Text></Text>
            <IconButton />
          </View>
        </View>
        <View>
          <Text></Text>
          <View></View>
        </View>
        <View>
          <Image source={{}} />
          <View>
            <Text></Text>
            <Text></Text>
          </View>
          <Button />
        </View>
      </ScrollView>
      <View>
        <Button />
        <Button />
      </View>
    </SafeAreaView>
  )
}

export default PrintPriceSign;
