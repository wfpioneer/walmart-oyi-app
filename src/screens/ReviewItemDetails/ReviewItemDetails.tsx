import React, {
  RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, BackHandler, Modal, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View
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
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import OHQtyUpdate from '../../components/ohqtyupdate/OHQtyUpdate';
import { setActionCompleted, setupScreen } from '../../state/actions/ItemDetailScreen';
import {
  resetLocations, setFloorLocations, setItemLocDetails, setReserveLocations
} from '../../state/actions/Location';
import { showInfoModal } from '../../state/actions/Modal';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';

const COMPLETE_API_409_ERROR = 'Request failed with status code 409';

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
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (navigation.isFocused()) {
      validateSession(navigation).then(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        dispatch({ type: 'API/GET_ITEM_DETAILS/RESET' });
        trackEvent('item_details_api_call', { barcode: scannedEvent.value });
        dispatch(getItemDetails({ headers: { userId }, id: scannedEvent.value }));
        dispatch({ type: 'API/ADD_TO_PICKLIST/RESET' });
      }).catch(() => {trackEvent('session_timeout', { user: userId })});
    }
  }, [scannedEvent]);

  // Get Item Details API
  useEffect(() => {
    if (error) {
      trackEvent('item_details_api_failure', { barcode: scannedEvent.value, errorDetails: error.message || error });
    }

    if (_.get(result, 'status') === 204) {
      trackEvent('item_details_api_not_found', { barcode: scannedEvent.value });
    }

    if (_.get(result, 'status') === 200) {
      trackEvent('item_details_api_success', { barcode: scannedEvent.value });
    }
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [error, result]);

  const itemDetails: ItemDetails = (result && result.data); // || getMockItemDetails(scannedEvent.value);
  const locationCount = floorLocations.length + reserveLocations.length;
  const updatedSalesTS = _.get(itemDetails, 'sales.lastUpdateTs')
    ? `${strings('GENERICS.UPDATED')} ${moment(itemDetails.sales.lastUpdateTs).format('dddd, MMM DD hh:mm a')}`
    : undefined;

  // Set Item Details
  useEffect(() => {
    if (itemDetails) {
      dispatch(resetLocations());
      dispatch(setupScreen(itemDetails.exceptionType, itemDetails.pendingOnHandsQty,
        itemDetails.exceptionType ? itemDetails.completed : true));
      dispatch(setItemLocDetails(itemDetails.itemNbr, itemDetails.upcNbr,
        itemDetails.exceptionType ? itemDetails.exceptionType : ''));
      if (itemDetails.location) {
        if (itemDetails.location.floor) dispatch(setFloorLocations(itemDetails.location.floor));
        if (itemDetails.location.reserve) dispatch(setReserveLocations(itemDetails.location.reserve));
      }
    }
  }, [itemDetails]);

  // Barcode event listener effect
  useEffect(() => {
    if (itemDetails && itemDetails.exceptionType && !actionCompleted) {
      const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
        if (navigation.isFocused()) {
          validateSession(navigation).then(() => {
            trackEvent('item_details_scan', { value: scan.value, type: scan.type });
            trackEvent('item_details_no_action_api_call', { itemDetails: JSON.stringify(result.data) });
            dispatch(noAction({ upc: result.data.upcNbr, itemNbr: result.data.itemNbr, scannedValue: scan.value }));
            dispatch(setManualScan(false));
          }).catch(() => {trackEvent('session_timeout', { user: userId })});
        }
      });
      return () => {
        // eslint-disable-next-line no-unused-expressions
        scanSubscription?.remove();
      };
    }
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation).then(() => {
          dispatch(setScannedEvent(scan));
        }).catch(() => {trackEvent('session_timeout', { user: userId })});
      }
    });
    return () => {
      // eslint-disable-next-line no-unused-expressions
      scanSubscription?.remove();
    };
  }, [itemDetails, actionCompleted]);

  // Complete API
  useEffect(() => {
    // on api success
    if (completeApiInProgress && completeApi.isWaiting === false && completeApi.result) {
      if (_.get(completeApi.result, 'status') === 204) {
        trackEvent('item_details_action_completed_api_failure_scan_no_match', { itemDetails: JSON.stringify(itemDetails) });
        dispatch(showInfoModal(strings('ITEM.SCAN_DOESNT_MATCH'), strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')));
      } else {
        trackEvent('item_details_action_completed_api_success', { itemDetails: JSON.stringify(itemDetails) });
        setCompleteApiInProgress(false);
        dispatch(setActionCompleted());
        navigation.goBack();
      }
      return undefined;
    }

    // on api failure
    if (completeApiInProgress && completeApi.isWaiting === false && completeApi.error) {
      if (completeApi.error === COMPLETE_API_409_ERROR) {
        trackEvent('item_details_action_completed_api_failure_scan_no_match', { itemDetails: JSON.stringify(itemDetails) });
        dispatch(showInfoModal(strings('ITEM.SCAN_DOESNT_MATCH'), strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')));
      } else {
        trackEvent('item_details_action_completed_api_failure', { itemDetails: JSON.stringify(itemDetails) });
        dispatch(showInfoModal(strings('ITEM.ACTION_COMPLETE_ERROR'), strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS')));
      }
      setCompleteApiInProgress(false);
      return undefined;
    }

    // on api submission
    if (!completeApiInProgress && completeApi.isWaiting) {
      trackEvent('item_details_action_completed_api_call', { itemDetails: JSON.stringify(itemDetails) });
      return setCompleteApiInProgress(true);
    }

    return undefined;
  }, [completeApi]);

  useFocusEffect(
    () => {
      const onBackPress = () => {
        if (!actionCompleted) {
          if (exceptionType === 'po') {
            trackEvent('item_details_back_press_action_incomplete', { exceptionType });
            dispatch(showInfoModal(strings('ITEM.NO_SIGN_PRINTED'), strings('ITEM.NO_SIGN_PRINTED_DETAILS')));
            return true;
          }
          if (exceptionType === 'nsfl') {
            trackEvent('item_details_back_press_action_incomplete', { exceptionType });
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
      <View style={styles.safeAreaView}>
        {isManualScanEnabled && <ManualScanComponent />}
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
          <Text style={styles.errorText}>{strings('ITEM.API_ERROR')}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => {
              trackEvent('item_details_api_retry', { barcode: scannedEvent.value });
              return dispatch(getItemDetails({ headers: { userId }, id: scannedEvent.value }));
            }}
          >
            <Text>{strings('GENERICS.RETRY')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (_.get(result, 'status') === 204) {
    return (
      <View style={styles.safeAreaView}>
        {isManualScanEnabled && <ManualScanComponent />}
        <View style={styles.activityIndicator}>
          <MaterialIcon name="info" size={40} color={COLOR.DISABLED_BLUE} />
          <Text style={styles.errorText}>{strings('ITEM.ITEM_NOT_FOUND')}</Text>
        </View>
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
    validateSession(navigation).then(() => {
      trackEvent('item_details_oh_quantity_update_click', { itemDetails: JSON.stringify(itemDetails) });
      setOhQtyModalVisible(true);
    }).catch(() => {trackEvent('session_timeout', { user: userId })});
  };

  const handleLocationAction = () => {
    validateSession(navigation).then(() => {
      trackEvent('item_details_location_details_click', { itemDetails: JSON.stringify(itemDetails) });
      navigation.navigate('LocationDetails');
    }).catch(() => {trackEvent('session_timeout', { user: userId })});
  };

  const handleAddToPicklist = () => {
    validateSession(navigation).then(() => {
      trackEvent('item_details_add_to_picklist_click', { itemDetails: JSON.stringify(itemDetails) });
      dispatch(addToPicklist({
        itemNumber: itemDetails.itemNbr
      }));
    }).catch(() => {trackEvent('session_timeout', { user: userId })});
  };

  const toggleSalesGraphView = () => {
    trackEvent('item_details_toggle_graph_click',
      { itemDetails: JSON.stringify(itemDetails), isGraphView: !isSalesMetricsGraphView });
    setIsSalesMetricsGraphView(prevState => !prevState);
  };

  const handleRefresh = () => {
    validateSession(navigation).then(() => {
      setIsRefreshing(true);
      trackEvent('refresh_item_details', { itemNumber: itemDetails.itemNbr});
      dispatch({ type: 'API/GET_ITEM_DETAILS/RESET' });
      trackEvent('item_details_api_call', { itemNumber: itemDetails.itemNbr });
      dispatch(getItemDetails({ headers: { userId }, id: itemDetails.itemNbr }))
    }).catch(() => {trackEvent('session_timeout', { user: userId })});
  }

  const renderOHQtyComponent = () => {
    if (pendingOnHandsQty === -999) {
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
    if (actionCompleted) {
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
      );
    }

    if (Platform.OS === 'android') {
      return (
        <TouchableOpacity
          style={styles.scanForNoActionButton}
          onPress={() => {
            validateSession(navigation).then(() => {
              trackEvent('item_details_scan_for_no_action_button_click', {itemDetails: JSON.stringify(itemDetails)});
              return dispatch(setManualScan(!isManualScanEnabled));
            }).catch(() => {trackEvent('session_timeout', { user: userId })
            });
          }}
        >
          <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE}/>
          <Text style={styles.buttonText}>{strings('ITEM.SCAN_FOR_NO_ACTION')}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.scanForNoActionButton} onPress={completeAction}>
        <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE}/>
        <Text style={styles.buttonText}>{strings('ITEM.SCAN_FOR_NO_ACTION')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeAreaView}>
      {isManualScanEnabled && <ManualScanComponent />}
      <Modal
        visible={ohQtyModalVisible}
        onRequestClose={() => setOhQtyModalVisible(false)}
        transparent
      >
        <OHQtyUpdate
          ohQty={itemDetails.onHandsQty}
          setOhQtyModalVisible={setOhQtyModalVisible}
          exceptionType={itemDetails.exceptionType}
        />
      </Modal>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container} 
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
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
              topRightBtnTxt={pendingOnHandsQty === -999 ? strings('GENERICS.CHANGE') : undefined}
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
    </View>
  );
};

export default ReviewItemDetails;
