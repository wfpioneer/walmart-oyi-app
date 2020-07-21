import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import { PrintPriceSignStackParamList } from '../../navigators/PrintPriceSignNavigator';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';

type PrintPriceSignScreenRouteParam = RouteProp<PrintPriceSignStackParamList, 'PrintPriceSignScreen'>

const PrintPriceSign = () => {
  const route = useRoute<PrintPriceSignScreenRouteParam>()
  const { itemName, itemNbr, upcNbr, category } = route.params;

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'stretch'}}>
        <View style={{backgroundColor: COLOR.WHITE, flexDirection: 'row', paddingHorizontal: 8, paddingTop: 16}}>
          <Image source={require('../../assets/images/sams_logo.jpeg')} style={{height: 65, width: 65, resizeMode: 'stretch'}} />
          <Text style={{marginHorizontal: 8, fontSize: 12, fontWeight: 'bold', flexWrap: 'wrap', flex: 1}} >{itemName}</Text>
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
