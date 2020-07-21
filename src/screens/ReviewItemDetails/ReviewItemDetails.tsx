import React, { createRef, RefObject, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';

import styles from './ReviewItemDetails.style';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import SFTCard from '../../components/sftcard/SFTCard';
import ItemDetails from '../../models/ItemDetails';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import COLOR from '../../themes/Color';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import Button from '../../components/button/Button';
import moment from 'moment';
import SalesMetrics from '../../components/salesmetrics/SalesMetrics';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import { useDispatch } from 'react-redux';

const ReviewItemDetails = (props: any) => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails)
  const { countryCode, siteId } = useTypedSelector(state => state.User);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isNavigationFocused = useIsFocused();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const [isSalesMetricsGraphView, setIsSalesMetricsGraphView] = useState(false);

  const itemDetails: ItemDetails = (result && result.data) || mockData[scannedEvent.value];
  const locationCount = itemDetails.location.count;
  const updatedSalesTS = moment(itemDetails.sales.lastUpdateTs).format('dddd, MMM DD hh:mm a');

  useEffect(() => {
    // Reset to top of screen
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: false});
    // TODO Call service here
  }, [scannedEvent])

  // Barcode event listener effect
  useEffect(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', (scan) => {
      if(isNavigationFocused) {
        console.log('review item details received scan', scan.value, scan.type);
        dispatch(setScannedEvent(scan));
        dispatch(setManualScan(false));
      }
    });

    return () => {
      scannedSubscription?.remove();
    }
  }, [])

  // Used to scroll to bottom when the sales metrics switches from daily to weekly
  // TODO this won't work because of changing data on scans
  const handleContentSizeChange = () => {
    scrollViewRef.current?.scrollToEnd();
  }

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

  const toggleSalesGraphView = () => {
    setIsSalesMetricsGraphView(prevState => !prevState);
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
      {isManualScanEnabled && <ManualScanComponent />}
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container} >
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
            <SFTCard
              title={strings('ITEM.SALES_METRICS')}
              subTitle={`${strings('GENERICS.UPDATED')} ${updatedSalesTS}`}
              bottomRightBtnTxt={['Toggle graph']}
              bottomRightBtnAction={[toggleSalesGraphView]}
            >
              <SalesMetrics itemDetails={itemDetails} isGraphView={isSalesMetricsGraphView} />
            </SFTCard>
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
      count: 10
    },
    sales: {
      lastUpdateTs: '2020-07-15T08:02:17-05:00',
      dailyAvgSales: 15,
      daily: [
        {
          day: '2020-07-08',
          value: 100
        },
        {
          day: '2020-07-09',
          value: 0
        },
        {
          day: '2020-07-10',
          value: 10
        },
        {
          day: '2020-07-11',
          value: 10
        },
        {
          day: '2020-07-12',
          value: 42
        },
        {
          day: '2020-07-13',
          value: 5
        },
        {
          day: '2020-07-14',
          value: 1
        }
      ],
      weeklyAvgSales: 10,
      weekly: [
        {
          week: 51,
          value: 0
        },
        {
          week: 1,
          value: 10
        },
        {
          week: 2,
          value: 100
        },
        {
          week: 3,
          value: 10
        }
      ]
    }
  },
  '456': {
    itemName: 'Small, Store Use Item',
    itemNbr: 987654321,
    upcNbr: '777555333',
    status: 'Active',
    category: '99 - Store Use',
    price: 2000.94,
    onHandsQty: 42,
    isOnHandsPending: false,
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
      reserve: [],
      count: 10
    },
    sales: {
      lastUpdateTs: '2020-07-15T08:02:17-05:00',
      dailyAvgSales: 15,
      daily: [
        {
          day: '2020-07-08',
          value: 10
        },
        {
          day: '2020-07-09',
          value: 0
        },
        {
          day: '2020-07-10',
          value: 10
        },
        {
          day: '2020-07-11',
          value: 10
        },
        {
          day: '2020-07-12',
          value: 42
        },
        {
          day: '2020-07-13',
          value: 5
        },
        {
          day: '2020-07-14',
          value: 1
        }
      ],
      weeklyAvgSales: 10,
      weekly: [
        {
          week: 51,
          value: 0
        },
        {
          week: 1,
          value: 10
        },
        {
          week: 2,
          value: 27
        },
        {
          week: 3,
          value: 10
        }
      ]
    }
  }
}
