import React, {
  RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getItemDetails } from '../../state/actions/saga';

import styles from './ReviewItemDetails.style';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import SFTCard from '../../components/sftcard/SFTCard';
import ItemDetails from '../../models/ItemDetails';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import Button from '../../components/buttons/Button';
import SalesMetrics from '../../components/salesmetrics/SalesMetrics';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import OHQtyUpdate from '../../components/ohqtyupdate/OHQtyUpdate';

const ReviewItemDetails = () => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails);
  const { userId } = useTypedSelector(state => state.User);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isNavigationFocused = useIsFocused();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const [isSalesMetricsGraphView, setIsSalesMetricsGraphView] = useState(false);
  const [ohQtyModalVisible, setOhQtyModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getItemDetails({ headers: { userId }, id: scannedEvent.value }));
  }, []);

  useEffect(() => {
    // Reset to top of screen
    // eslint-disable-next-line no-unused-expressions
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    // TODO Call get item details service here
  }, [scannedEvent]);

  // Barcode event listener effect
  useEffect(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (isNavigationFocused) {
        dispatch(setScannedEvent(scan));
        dispatch(setManualScan(false));
      }
    });

    return () => {
      // eslint-disable-next-line no-unused-expressions
      scannedSubscription?.remove();
    };
  }, []);

  if (error) {
    return (
      <View style={styles.activityIndicator}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('ITEM.API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => dispatch(getItemDetails({ headers: { userId }, id: scannedEvent.value }))}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isWaiting || !result) {
    return (
      <ActivityIndicator
        animating={isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  const itemDetails: ItemDetails = (result && result.data);// || getMockItemDetails(scannedEvent.value);
  const locationCount = itemDetails.location.count;
  const updatedSalesTS = moment(itemDetails.sales.lastUpdateTs).format('dddd, MMM DD hh:mm a');

  // Used to scroll to bottom when the sales metrics switches from daily to weekly
  // TODO this won't work because of changing data on scans
  const handleContentSizeChange = () => {
    // eslint-disable-next-line no-unused-expressions
     scrollViewRef.current?.scrollToEnd();
  };

  const handleUpdateQty = () => {
    setOhQtyModalVisible(true);
  };

  const handleLocationAction = () => {
    navigation.navigate({
      name: 'LocationDetails',
      params: { floorLoc: itemDetails.location.floor, resLoc: itemDetails.location.reserve }
    });
  };

  const handleAddToPicklist = () => {
    // TODO Call service for picklist here
  };

  const toggleSalesGraphView = () => {
    setIsSalesMetricsGraphView(prevState => !prevState);
  };

  const renderOHQtyComponent = () => (
    <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{strings('ITEM.ON_HANDS')}</Text>
        <Text>{itemDetails.onHandsQty}</Text>
      </View>
      {itemDetails.isOnHandsPending
        && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <FontAwesome5Icon name="info-circle" size={12} color={COLOR.GREY_700} style={{ paddingRight: 6 }} />
          <Text>{strings('ITEM.PENDING_MGR_APPROVAL')}</Text>
        </View>
        )
        }
    </View>
  );

  const renderLocationComponent = () => {
    const { floor, reserve } = itemDetails.location;

    return (
      <View style={{ paddingHorizontal: 8 }}>
        <View style={styles.locationDetailsContainer}>
          <Text>{strings('ITEM.FLOOR')}</Text>
          {floor && floor.length >= 1
            ? <Text>{floor[0].name}</Text>
            : (
              <Button
                type={3}
                title={strings('GENERICS.ADD')}
                titleColor={COLOR.MAIN_THEME_COLOR}
                titleFontSize={12}
                titleFontWeight="bold"
                height={28}
                onPress={handleLocationAction}
              />
            )
          }
        </View>
        <View style={styles.locationDetailsContainer}>
          <Text>{strings('ITEM.RESERVE')}</Text>
          {reserve && reserve.length >= 1
            ? <Text>{reserve[0].name}</Text>
            : (
              <Button
                type={3}
                title={strings('GENERICS.ADD')}
                titleColor={COLOR.MAIN_THEME_COLOR}
                titleFontSize={12}
                titleFontWeight="bold"
                height={28}
                onPress={handleLocationAction}
              />
            )
          }
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 8 }}>
          {reserve && reserve.length >= 1
            ? (
              <Button
                type={3}
                title={strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST')}
                titleColor={COLOR.MAIN_THEME_COLOR}
                titleFontSize={12}
                titleFontWeight="bold"
                height={28}
                onPress={handleAddToPicklist}
              />
            )
            : <Text>{strings('ITEM.RESERVE_NEEDED')}</Text>
          }
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isManualScanEnabled && <ManualScanComponent />}
      <Modal
        visible={ohQtyModalVisible}
        onRequestClose={() => setOhQtyModalVisible(false)}
        transparent
      >
        <OHQtyUpdate ohQty={itemDetails.onHandsQty} setOhQtyModalVisible={setOhQtyModalVisible} />
      </Modal>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        {isWaiting && (
        <ActivityIndicator
          animating={isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
        )}
        {!isWaiting && itemDetails
          && (
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
              iconName="pallet"
              topRightBtnTxt={strings('GENERICS.CHANGE')}
              topRightBtnAction={handleUpdateQty}
            >
              {renderOHQtyComponent()}
            </SFTCard>
            <SFTCard
              iconProp={(
                <MaterialCommunityIcon
                  name="label-variant"
                  size={20}
                  color={COLOR.GREY_700}
                  style={{ marginLeft: -4 }}
                />
)}
              title="Replenishment"
            >
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 16
              }}
              >
                <Text>{strings('ITEM.ON_ORDER')}</Text>
                <Text>{itemDetails.replenishment.onOrder}</Text>
              </View>
            </SFTCard>
            <SFTCard
              iconName="map-marker-alt"
              title={`${strings('ITEM.LOCATION')}(${locationCount})`}
              topRightBtnTxt={locationCount && locationCount >= 1
                ? strings('GENERICS.SEE_ALL') : strings('GENERICS.ADD')}
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
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewItemDetails;
