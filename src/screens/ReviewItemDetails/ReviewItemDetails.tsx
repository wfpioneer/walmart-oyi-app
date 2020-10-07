import React, {
  RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, BackHandler, Modal, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import _ from 'lodash';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { addToPicklist, getItemDetails, noAction } from '../../state/actions/saga';

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
import { setManualScan } from '../../state/actions/Global';
import OHQtyUpdate from '../../components/ohqtyupdate/OHQtyUpdate';
import { setActionCompleted, setupScreen } from '../../state/actions/ItemDetailScreen';
import { resetLocations, setFloorLocations, setItemLocDetails, setReserveLocations } from '../../state/actions/Location';
import { showInfoModal } from '../../state/actions/Modal';

const ReviewItemDetails = () => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails);
  const addToPicklistStatus = useTypedSelector(state => state.async.addToPicklist);
  const completeApi = useTypedSelector(state => state.async.noAction);
  const { userId } = useTypedSelector(state => state.User);
  const { exceptionType, actionCompleted, pendingOnHandsQty } = useTypedSelector(state => state.ItemDetailScreen);
  const { floorLocations, reserveLocations } = useTypedSelector(state => state.Location);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const [isSalesMetricsGraphView, setIsSalesMetricsGraphView] = useState(false);
  const [ohQtyModalVisible, setOhQtyModalVisible] = useState(false);
  const [completeApiInProgress, setCompleteApiInProgress] = useState(false);

  useEffect(() => {
    dispatch({ type: 'API/GET_ITEM_DETAILS/RESET' });
    dispatch(getItemDetails({ headers: { userId }, id: scannedEvent.value }));
    dispatch({ type: 'API/ADD_TO_PICKLIST/RESET' });
  }, []);

  useEffect(() => {
    // Reset to top of screen
    // eslint-disable-next-line no-unused-expressions
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    // TODO Call get item details service here
  }, [scannedEvent]);

  // Barcode event listener effect
  useEffect(() => {
    if (!isWaiting && !error && result) {
      const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
        if (navigation.isFocused()) {
          if (scan.value === scannedEvent.value || scan.value === result.data.upcNbr || scan.value === result.data.itemNbr.toString()) {
            if (!actionCompleted) {
              dispatch(noAction({upc: result.data.upcNbr, itemNbr: result.data.itemNbr, scannedValue: scan.value}));
            } else {
              navigation.goBack();
            }
          } else {
            dispatch(showInfoModal(strings('ITEM.SCAN_DOESNT_MATCH'), strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')));
          }
          dispatch(setManualScan(false));
        }
      });
      return () => {
        // eslint-disable-next-line no-unused-expressions
        scanSubscription?.remove();
      };
    }
  }, [isWaiting, result]);

  const itemDetails: ItemDetails = (result && result.data); // || getMockItemDetails(scannedEvent.value);

  const locationCount = floorLocations.length + reserveLocations.length;
  const updatedSalesTS = _.get(itemDetails, 'sales.lastUpdateTs')
    ? `${strings('GENERICS.UPDATED')} ${moment(itemDetails.sales.lastUpdateTs).format('dddd, MMM DD hh:mm a')}`
    : undefined;

  useEffect(() => {
    if (itemDetails) {
      dispatch(resetLocations());
      dispatch(setupScreen(itemDetails.exceptionType, itemDetails.pendingOnHandsQty));
      dispatch(setItemLocDetails(itemDetails.itemNbr, itemDetails.upcNbr, itemDetails.exceptionType));
      if (itemDetails.location) {
        if (itemDetails.location.floor) dispatch(setFloorLocations(itemDetails.location.floor));
        if (itemDetails.location.reserve) dispatch(setReserveLocations(itemDetails.location.reserve));
      }
    }
  }, [itemDetails]);

  useEffect(() => {
    // on api success
    if (completeApiInProgress && completeApi.isWaiting === false && completeApi.result) {
      setCompleteApiInProgress(false);
      dispatch(setActionCompleted());
      navigation.goBack();
      return undefined;
    }

    // on api failure
    if (completeApiInProgress && completeApi.isWaiting === false && completeApi.error) {
      setCompleteApiInProgress(false);
      dispatch(showInfoModal(strings('ITEM.ACTION_COMPLETE_ERROR'), strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS')));
      return undefined;
    }

    // on api submission
    if (!completeApiInProgress && completeApi.isWaiting) {
      return setCompleteApiInProgress(true);
    }

    return undefined;
  }, [completeApi]);

  useFocusEffect(
    () => {
      const onBackPress = () => {
        if (!actionCompleted) {
          if (exceptionType === 'po') {
            dispatch(showInfoModal(strings('ITEM.NO_SIGN_PRINTED'), strings('ITEM.NO_SIGN_PRINTED_DETAILS')));
            return true;
          }
          if (exceptionType === 'nsfl') {
            dispatch(showInfoModal(strings('ITEM.NO_FLOOR_LOCATION'), strings('ITEM.NO_FLOOR_LOCATION_DETAILS')));
            return true;
          }
        }

        dispatch(setManualScan(false));
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  );

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

  if (_.get(result, 'status') === 204) {
    return (
      <View style={styles.activityIndicator}>
        <MaterialIcon name="info" size={40} color={COLOR.DISABLED_BLUE} />
        <Text style={styles.errorText}>{strings('ITEM.ITEM_NOT_FOUND')}</Text>
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

  const handleUpdateQty = () => {
    setOhQtyModalVisible(true);
  };

  const handleLocationAction = () => {
    navigation.navigate('LocationDetails');
  };

  const handleAddToPicklist = () => {
    dispatch(addToPicklist({
      itemNumber: itemDetails.itemNbr
    }));
  };

  const toggleSalesGraphView = () => {
    setIsSalesMetricsGraphView(prevState => !prevState);
  };

  const renderOHQtyComponent = () => {
    if (!pendingOnHandsQty || pendingOnHandsQty === -999) {
      return (
        <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{strings('ITEM.ON_HANDS')}</Text>
            <Text>{itemDetails.onHandsQty}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{strings('ITEM.ON_HANDS')}</Text>
          <Text>{pendingOnHandsQty}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <FontAwesome5Icon name="info-circle" size={12} color={COLOR.GREY_700} style={{ paddingRight: 6 }} />
          <Text>{strings('ITEM.PENDING_MGR_APPROVAL')}</Text>
        </View>
      </View>
    );
  };

  const renderAddPicklistButton = () => {
    const { reserve } = itemDetails.location;

    if (addToPicklistStatus.isWaiting) {
      return <ActivityIndicator />;
    }

    if (addToPicklistStatus.result) {
      return <Text style={styles.picklistSuccessText}>{strings('ITEM.ADDED_TO_PICKLIST')}</Text>;
    }

    if (addToPicklistStatus.error) {
      return (
        <View style={styles.picklistErrorView}>
          <Text style={styles.picklistErrorText}>{strings('ITEM.ADDED_TO_PICKLIST_ERROR')}</Text>
          <Button
            type={3}
            title={strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={12}
            titleFontWeight="bold"
            height={28}
            onPress={handleAddToPicklist}
          />
        </View>
      );
    }

    if (reserve && reserve.length >= 1) {
      return (
        <Button
          type={3}
          title={strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          titleFontSize={12}
          titleFontWeight="bold"
          height={28}
          onPress={handleAddToPicklist}
        />
      );
    }

    return <Text>{strings('ITEM.RESERVE_NEEDED')}</Text>;
  };

  const renderLocationComponent = () => (
    <View style={{ paddingHorizontal: 8 }}>
      <View style={styles.locationDetailsContainer}>
        <Text>{strings('ITEM.FLOOR')}</Text>
        {floorLocations && floorLocations.length >= 1
          ? <Text>{floorLocations[0].locationName}</Text>
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
        {reserveLocations && reserveLocations.length >= 1
          ? <Text>{reserveLocations[0].locationName}</Text>
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
        {renderAddPicklistButton()}
      </View>
    </View>
  );

  const completeAction = () => {
    // TODO: reinstantiate when ios device support is needed
    // dispatch(actionCompletedAction());
    // dispatch(navigation.goBack());
  };

  const renderScanForNoActionButton = () => {
    if (!exceptionType) {
      return null;
    }

    if (completeApi.isWaiting) {
      return (
        <ActivityIndicator
          animating={completeApi.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.completeActivityIndicator}
        />
      )
    }

    if (Platform.OS === 'android') {
      return (
        <TouchableOpacity style={styles.scanForNoActionButton} onPress={() => dispatch(setManualScan(!isManualScanEnabled))}>
          <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
          <Text style={styles.buttonText}>{strings('ITEM.SCAN_FOR_NO_ACTION')}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.scanForNoActionButton} onPress={completeAction}>
        <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
        <Text style={styles.buttonText}>{strings('ITEM.SCAN_FOR_NO_ACTION')}</Text>
      </TouchableOpacity>
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
              category={`${itemDetails.categoryNbr} - ${itemDetails.categoryDesc}`}
              price={itemDetails.price}
              exceptionType={!actionCompleted ? itemDetails.exceptionType : undefined}
            />
            <SFTCard
              title={strings('ITEM.QUANTITY')}
              iconName="pallet"
              topRightBtnTxt={itemDetails.pendingOnHandsQty === -999 ? strings('GENERICS.CHANGE') : undefined}
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
              title={strings('ITEM.REPLENISHMENT')}
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
              subTitle={updatedSalesTS}
              bottomRightBtnTxt={[strings('ITEM.TOGGLE_GRAPH')]}
              bottomRightBtnAction={[toggleSalesGraphView]}
            >
              <SalesMetrics itemDetails={itemDetails} isGraphView={isSalesMetricsGraphView} />
            </SFTCard>
          </View>
          )
        }
      </ScrollView>
      { renderScanForNoActionButton() }
    </SafeAreaView>
  );
};

export default ReviewItemDetails;
