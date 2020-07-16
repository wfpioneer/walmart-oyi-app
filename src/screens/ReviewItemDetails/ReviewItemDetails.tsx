import React, { useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';

import styles from './ReviewItemDetails.style';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import SFTCard from '../../components/sftcard/SFTCard';
import ItemDetails from '../../models/ItemDetails';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../themes/Color';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { strings } from '../../locales';
import Location from '../../models/Location';
import Button from '../../components/button/Button';

const ReviewItemDetails = (props: any) => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails)
  const { countryCode, siteId } = useTypedSelector(state => state.User);
  const navigation = useNavigation();

  const itemDetails: ItemDetails = (result && result.data) || mockData[scannedEvent.value];
  const locationCount = itemDetails.location.count;

  useEffect(() => {
    // TODO Call service here
  }, [scannedEvent])

  const handleUpdateQty = () => {
    // TODO display popup/modal
    console.log('Change qty clicked!');
  }

  const handleLocationAction = () => {
    // TODO navigate to location screen
    console.log('Handle location screen');
  }

  const handleAddToPicklist = () => {
    // TODO Call service for picklist here
    console.log('Add to picklist clicked!');
  }

  const renderOHQtyComponent = () => {
    return (
      <View style={{paddingHorizontal: 8, paddingVertical: 16}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{strings('ITEM.ON_HANDS')}</Text>
          <Text>{itemDetails.onHandsQty}</Text>
        </View>
        {itemDetails.isOnHandsPending &&
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
          <FontAwesome5Icon name={'info-circle'} size={12} color={COLOR.GREY_700} style={{paddingRight: 6}}/>
          <Text>{strings('ITEM.PENDING_MGR_APPROVAL')}</Text>
        </View>
        }
      </View>
    );
  }

  const renderLocationComponent = () => {
    const { floor, reserve } = itemDetails.location;

    return (
      <View style={{paddingHorizontal: 8}}>
        <View style={styles.locationDetailsContainer}>
          <Text>{strings('ITEM.FLOOR')}</Text>
          {floor && floor.length >= 1 ?
            <Text>{floor[0].name}</Text>
            :
            <Button
              type={3}
              title={strings('GENERICS.ADD')}
              titleColor={COLOR.MAIN_THEME_COLOR}
              titleFontSize={12}
              titleFontWeight={'bold'}
              height={28}
              onPress={handleLocationAction}
            />
          }
        </View>
        <View style={styles.locationDetailsContainer}>
          <Text>{strings('ITEM.RESERVE')}</Text>
          {reserve && reserve.length >= 1 ?
            <Text>{reserve[0].name}</Text>
            :
            <Button
              type={3}
              title={strings('GENERICS.ADD')}
              titleColor={COLOR.MAIN_THEME_COLOR}
              titleFontSize={12}
              titleFontWeight={'bold'}
              height={28}
              onPress={handleLocationAction}
            />
          }
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 8}}>
          {reserve && reserve.length >= 1 ?
            <Button
              type={3}
              title={strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST')}
              titleColor={COLOR.MAIN_THEME_COLOR}
              titleFontSize={12}
              titleFontWeight={'bold'}
              height={28}
              onPress={handleAddToPicklist}
            />
            :
            <Text>{strings('ITEM.RESERVE_NEEDED')}</Text>
          }
        </View>
      </View>
    );
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
              {renderOHQtyComponent()}
            </SFTCard>
            <SFTCard
              iconProp={<MaterialCommunityIcon name={'label-variant'} size={20} color={COLOR.GREY_700} style={{marginLeft: -4}} />}
              title={'Replenishment'}
            >
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 16}}>
                <Text>{strings('ITEM.ON_ORDER')}</Text>
                <Text>{itemDetails.replenishment.onOrder}</Text>
              </View>
            </SFTCard>
            <SFTCard
              iconName={'map-marker-alt'}
              title={`${strings('ITEM.LOCATION')}(${locationCount})`}
              topRightBtnTxt={locationCount && locationCount >= 1 ? strings('GENERICS.SEE_ALL') : strings('GENERICS.ADD')}
              topRightBtnAction={handleLocationAction}
            >
              {renderLocationComponent()}
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
    isOnHandsPending: true,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          id: '1',
          type: 'pod',
          name: 'F15-4'
        }
      ],
      reserve: [
        {
          id: '2',
          type: 'reserve',
          name: 'F15-4'
        }
      ],
      // reserve: [],
      count: 10
    }
  }
}
