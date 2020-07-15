import React, { useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, Button, Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';

import styles from './ReviewItemDetails.style';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import SFTCard from '../../components/sftcard/SFTCard';
import ItemDetails from '../../models/ItemDetails';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../themes/Color';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { strings } from '../../locales';

const renderOHQtyComponent = (ohQty: number, isOnHandsPending: boolean) => {

  return (
    <View style={{paddingHorizontal: 8, paddingVertical: 16}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text>{strings('ITEM.ON_HANDS')}</Text>
        <Text>{ohQty}</Text>
      </View>
      {isOnHandsPending &&
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
          <FontAwesome5Icon name={'info-circle'} size={12} color={COLOR.GREY_700} style={{paddingRight: 6}}/>
          <Text>{strings('ITEM.PENDING_MGR_APPROVAL')}</Text>
        </View>
      }
    </View>
  );
}

const ReviewItemDetails = (props: any) => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails)
  const { countryCode, siteId } = useTypedSelector(state => state.User);
  const navigation = useNavigation();

  let itemDetails: ItemDetails = (result && result.data) || mockData[scannedEvent.value];

  useEffect(() => {
    // TODO Call service here
  }, [scannedEvent])

  const handleUpdateQty = () => {
    // TODO display popup/modal
    console.log('Change qty clicked!')
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        {isWaiting && <ActivityIndicator
          animating={isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />}
        {!isWaiting && itemDetails &&
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
            <SFTCard
              title={strings('ITEM.QUANTITY')}
              iconName={'pallet'}
              topRightBtnTxt={strings('GENERICS.CHANGE')}
              topRightBtnAction={handleUpdateQty}
            >
              {renderOHQtyComponent(itemDetails.onHandsQty, itemDetails.isOnHandsPending)}
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
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReviewItemDetails



// TODO TEMP FOR TESTING BEFORE HOOKING UP SERVICES
const mockData: any = {
  '123': {
    itemName: 'Test Item That is Really, Really Long (and has parenthesis)',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    status: 'Active',
    category: '93 - Meat PI',
    price: 2000.94,
    exceptionType: 'po',
    onHandsQty: 42,
    isOnHandsPending: true
  }
}
