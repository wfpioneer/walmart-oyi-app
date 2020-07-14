import React, { useEffect, useLayoutEffect } from 'react';
import { Button, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';

import styles from './ReviewItemDetails.style';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import SFTCard from '../../components/sftcard/SFTCard';
import ItemDetails from '../../models/ItemDetails';
import {useNavigation} from '@react-navigation/native';

const ReviewItemDetails = (props: any) => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { countryCode, siteId } = useTypedSelector(state => state.User);
  const navigation = useNavigation();

  let itemDetails: ItemDetails = mockData['123'];

  useEffect(() => {
    // Call service here
    itemDetails = mockData[scannedEvent.value];
  }, [scannedEvent])

  return (
    <View>
      <ItemInfo
        itemName={itemDetails.itemName}
        itemNbr={itemDetails.itemNbr}
        upcNbr={itemDetails.upcNbr}
        status={itemDetails.status}
        category={itemDetails.category}
        price={itemDetails.price}
        exceptionType={itemDetails.exceptionType}
      />
      <SFTCard iconName={'rocket'} title={'Quantity'}>
        {/* Quantity placeholder */}
      </SFTCard>
      <SFTCard iconName={'rocket'} title={'Replenishment'}>
        {/* Replenishment placeholder */}
      </SFTCard>
      <SFTCard iconName={'rocket'} title={'Locations (?)'}>
        {/* Locations placeholder */}
      </SFTCard>
      <View>
        {/* Sales Metrics placeholder */}
      </View>
    </View>
  )
}

export default ReviewItemDetails



// TODO TEMP FOR TESTING BEFORE HOOKING UP SERVICES
const mockData = {
  '123': {
    itemName: 'Test Item That is Really, Really Long (and has parenthesis)',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    status: 'Active',
    category: '93 - Meat PI',
    price: '2.94',
    exceptionType: 'po'
  }
}
