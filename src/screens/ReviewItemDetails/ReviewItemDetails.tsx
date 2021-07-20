import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, BackHandler, Modal, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import _ from 'lodash';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
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
import Location from '../../models/Location';
import { AsyncState } from '../../models/AsyncState';

const COMPLETE_API_409_ERROR = 'Request failed with status code 409';
export interface ItemDetailsScreenProps {
  scannedEvent: any; isManualScanEnabled: boolean;
  isWaiting: boolean; error: any; result: any;
  addToPicklistStatus: AsyncState;
  completeItemApi: AsyncState;
  userId: string;
  exceptionType: string; actionCompleted: boolean; pendingOnHandsQty: number;
  floorLocations?: Location[];
  reserveLocations?: Location[];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  scrollViewRef: RefObject<ScrollView>;
  isSalesMetricsGraphView: boolean; setIsSalesMetricsGraphView: React.Dispatch<React.SetStateAction<boolean>>;
  ohQtyModalVisible: boolean; setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errorModalVisible: boolean; setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isRefreshing: boolean; setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  apiStart: number; setApiStart: React.Dispatch<React.SetStateAction<number>>;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  useFocusEffectHook: (effect: EffectCallback) => void;
}

export interface HandleProps{
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  trackEventCall: (eventName: string, params?: any) => void;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  userId?: string;
  setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
}
export interface RenderProps {
  actionCompleted: boolean;
  completeItemApi: AsyncState;
  addToPicklistStatus: AsyncState;
  isManualScanEnabled: boolean;
  floorLocations?: Location[];
  reserveLocations?: Location[];
}
const handleUpdateQty = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, setOhQtyModalVisible, userId
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall('item_details_oh_quantity_update_click', { itemDetails: JSON.stringify(itemDetails) });
    setOhQtyModalVisible(true);
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

const handleLocationAction = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, userId
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall('item_details_location_details_click', { itemDetails: JSON.stringify(itemDetails) });
    navigation.navigate('LocationDetails');
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

const handleAddToPicklist = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, userId, dispatch
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall('item_details_add_to_picklist_click', { itemDetails: JSON.stringify(itemDetails) });
    dispatch(addToPicklist({
      itemNumber: itemDetails.itemNbr
    }));
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

export const renderOHQtyComponent = (onHandsQty: number, pendingOnHandsQty: number): JSX.Element => {
  if (pendingOnHandsQty === -999) {
    return (
      <View style={styles.onHandsContainer}>
        <View style={styles.onHandsView}>
          <Text>{strings('ITEM.ON_HANDS')}</Text>
          <Text>{onHandsQty}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.onHandsContainer}>
      <View style={styles.onHandsView}>
        <Text>{strings('ITEM.ON_HANDS')}</Text>
        <Text>{pendingOnHandsQty}</Text>
      </View>
      <View style={styles.mgrApprovalView}>
        <FontAwesome5Icon name="info-circle" size={12} color={COLOR.GREY_700} style={styles.infoIcon} />
        <Text>{strings('ITEM.PENDING_MGR_APPROVAL')}</Text>
      </View>
    </View>
  );
};

export const renderAddPicklistButton = (props: (RenderProps & HandleProps), itemDetails: ItemDetails): JSX.Element => {
  const { reserve } = itemDetails.location;
  const { addToPicklistStatus } = props;
  if (addToPicklistStatus?.isWaiting) {
    return <ActivityIndicator />;
  }

  if (addToPicklistStatus?.result) {
    return <Text style={styles.picklistSuccessText}>{strings('ITEM.ADDED_TO_PICKLIST')}</Text>;
  }

  if (addToPicklistStatus?.error) {
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
          onPress={() => handleAddToPicklist(props, itemDetails)}
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
        onPress={() => handleAddToPicklist(props, itemDetails)}
      />
    );
  }

  return <Text>{strings('ITEM.RESERVE_NEEDED')}</Text>;
};

export const renderLocationComponent = (props: (RenderProps & HandleProps), itemDetails: ItemDetails): JSX.Element => {
  const { floorLocations, reserveLocations } = props;
  return (
    <View style={styles.locationContainer}>
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
              onPress={() => handleLocationAction(props, itemDetails)}
            />
          )}
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
              onPress={() => handleLocationAction(props, itemDetails)}
            />
          )}
      </View>
      <View style={styles.renderPickListContatiner}>
        {renderAddPicklistButton(props, itemDetails)}
      </View>
    </View>
  );
};

const completeAction = () => {
  // TODO: reinstantiate when ios device support is needed
  // dispatch(actionCompletedAction());
  // dispatch(navigation.goBack());
};

export const renderScanForNoActionButton = (
  props: (RenderProps & HandleProps), itemDetails: ItemDetails
): JSX.Element => {
  const {
    actionCompleted, completeItemApi, validateSessionCall, trackEventCall,
    dispatch, userId, isManualScanEnabled, navigation, route
  } = props;

  if (actionCompleted) {
    return <View />;
  }

  if (completeItemApi?.isWaiting) {
    return (
      <ActivityIndicator
        animating={completeItemApi.isWaiting}
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
          validateSessionCall(navigation, route.name).then(() => {
            trackEventCall('item_details_scan_for_no_action_button_click',
              { itemDetails: JSON.stringify(itemDetails) });
            return dispatch(setManualScan(!isManualScanEnabled));
          }).catch(() => {
            trackEventCall('session_timeout', { user: userId });
          });
        }}
      >
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

// Renders scanned barcode error. TODO Temporary fix until Modal.tsx is refactored for more flexible usage
export const renderBarcodeErrorModal = (
  isVisible: boolean, setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
): JSX.Element => (
  <Modal
    visible={isVisible}
    transparent
  >
    <View style={styles.modalContainer}>
      <View style={styles.barcodeErrorContainer}>
        <MaterialCommunityIcon name="alert" size={30} color={COLOR.RED_500} style={styles.iconPosition} />
        <Text style={styles.errorText}>
          {strings('GENERICS.BARCODE_SCAN_ERROR')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.dismissButton}
            title={strings('GENERICS.OK')}
            backgroundColor={COLOR.TRACKER_RED}
            onPress={() => setIsVisible(false)}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export const ReviewItemDetailsScreen = (props: ItemDetailsScreenProps): JSX.Element => {
  const {
    scannedEvent, isManualScanEnabled,
    isWaiting, error, result,
    completeItemApi,
    userId,
    exceptionType, actionCompleted, pendingOnHandsQty,
    floorLocations, reserveLocations,
    route,
    dispatch,
    navigation,
    scrollViewRef,
    isSalesMetricsGraphView, setIsSalesMetricsGraphView,
    ohQtyModalVisible, setOhQtyModalVisible,
    isRefreshing, setIsRefreshing,
    apiStart, setApiStart,
    errorModalVisible, setErrorModalVisible,
    trackEventCall,
    validateSessionCall,
    useEffectHook,
    useFocusEffectHook
  } = props;
  // Scanned Item Event Listener
  useEffectHook(() => {
    if (navigation.isFocused()) {
      validateSessionCall(navigation, route.name).then(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        setApiStart(moment().valueOf());
        dispatch({ type: 'API/GET_ITEM_DETAILS/RESET' });
        dispatch(getItemDetails({ headers: { userId }, id: scannedEvent.value }));
        dispatch({ type: 'API/ADD_TO_PICKLIST/RESET' });
      }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
    }
  }, [scannedEvent]);

  // Get Item Details API
  useEffectHook(() => {
    if (error) {
      trackEventCall('item_details_api_failure',
        {
          barcode: scannedEvent.value,
          errorDetails: error.message || JSON.stringify(error),
          duration: moment().valueOf() - apiStart
        });
    }

    if (_.get(result, 'status') === 204) {
      trackEventCall('item_details_api_not_found',
        { barcode: scannedEvent.value, duration: moment().valueOf() - apiStart });
    }

    if (_.get(result, 'status') === 200) {
      trackEventCall('item_details_api_success',
        { barcode: scannedEvent.value, duration: moment().valueOf() - apiStart });
    }

    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [error, result]);

  const itemDetails: ItemDetails = (result && result.data); // || getMockItemDetails(scannedEvent.value);
  const locationCount = (floorLocations?.length ?? 0) + (reserveLocations?.length ?? 0);
  const updatedSalesTS = _.get(itemDetails, 'sales.lastUpdateTs')
    ? `${strings('GENERICS.UPDATED')} ${moment(itemDetails.sales.lastUpdateTs).format('dddd, MMM DD hh:mm a')}`
    : undefined;

  // Set Item Details
  useEffectHook(() => {
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
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall('item_details_scan', { value: scan.value, type: scan.type });
          if (!(scan.type.includes('QR Code') || scan.type.includes('QRCODE'))) {
            if (itemDetails && itemDetails.exceptionType && !actionCompleted) {
              setApiStart(moment().valueOf());
              dispatch(noAction({ upc: itemDetails.upcNbr, itemNbr: itemDetails.itemNbr, scannedValue: scan.value }));
              dispatch(setManualScan(false));
            } else {
              dispatch(setScannedEvent(scan));
            }
          } else {
            setErrorModalVisible(true);
          }
        }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
      }
    });
    return () => {
      scanSubscription.remove();
    };
  }, [itemDetails, actionCompleted]);

  // Complete Item Details API
  useEffectHook(() => {
    // on api success
    if (!completeItemApi.isWaiting && completeItemApi.result) {
      if (_.get(completeItemApi.result, 'status') === 204) {
        trackEventCall('item_details_action_completed_api_success_scan_no_match',
          {
            itemDetails: JSON.stringify(itemDetails),
            duration: moment().valueOf() - apiStart,
            status: result.status
          });
        dispatch(showInfoModal(strings('ITEM.SCAN_DOESNT_MATCH'), strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')));
      } else {
        trackEventCall('item_details_action_completed_api_success',
          { itemDetails: JSON.stringify(itemDetails), duration: moment().valueOf() - apiStart });
        dispatch(setActionCompleted());
        navigation.goBack();
      }
    }

    // on api failure
    if (!completeItemApi.isWaiting && completeItemApi.error) {
      if (completeItemApi.error === COMPLETE_API_409_ERROR) {
        trackEventCall('item_details_action_completed_api_failure_scan_no_match',
          {
            itemDetails: JSON.stringify(itemDetails),
            duration: moment().valueOf() - apiStart,
            errorDetails: completeItemApi.error.message || completeItemApi.error
          });
        dispatch(showInfoModal(strings('ITEM.SCAN_DOESNT_MATCH'), strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')));
      } else {
        trackEventCall('item_details_action_completed_api_failure',
          {
            itemDetails: JSON.stringify(itemDetails),
            duration: moment().valueOf() - apiStart,
            errorDetails: completeItemApi.error.message || completeItemApi.error
          });
        dispatch(showInfoModal(strings('ITEM.ACTION_COMPLETE_ERROR'), strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS')));
      }
    }
  }, [completeItemApi]);

  useFocusEffectHook(
    () => {
      const onBackPress = () => {
        if (!actionCompleted) {
          if (exceptionType === 'po') {
            trackEventCall('item_details_back_press_action_incomplete', { exceptionType });
            dispatch(showInfoModal(strings('ITEM.NO_SIGN_PRINTED'), strings('ITEM.NO_SIGN_PRINTED_DETAILS')));
            return true;
          }
          if (exceptionType === 'nsfl') {
            trackEventCall('item_details_back_press_action_incomplete', { exceptionType });
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

  // Get Item Details Error
  if (error) {
    return (
      <View style={styles.safeAreaView}>
        {renderBarcodeErrorModal(errorModalVisible, setErrorModalVisible)}
        {isManualScanEnabled && <ManualScanComponent />}
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
          <Text style={styles.errorText}>{strings('ITEM.API_ERROR')}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => {
              setApiStart(moment().valueOf());
              trackEventCall('item_details_api_retry', { barcode: scannedEvent.value });
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
        {renderBarcodeErrorModal(errorModalVisible, setErrorModalVisible)}
        {isManualScanEnabled && <ManualScanComponent />}
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
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

  const toggleSalesGraphView = () => {
    trackEventCall('item_details_toggle_graph_click',
      { itemDetails: JSON.stringify(itemDetails), isGraphView: !isSalesMetricsGraphView });
    setIsSalesMetricsGraphView((prevState: boolean) => !prevState);
  };

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name).then(() => {
      setIsRefreshing(true);
      setApiStart(moment().valueOf());
      trackEventCall('refresh_item_details', { itemNumber: itemDetails.itemNbr });
      dispatch({ type: 'API/GET_ITEM_DETAILS/RESET' });
      dispatch(getItemDetails({ headers: { userId }, id: itemDetails.itemNbr }));
    }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
  };

  return (
    <View style={styles.safeAreaView}>
      {isManualScanEnabled && <ManualScanComponent />}
      {renderBarcodeErrorModal(errorModalVisible, setErrorModalVisible)}
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
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
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
              status={itemDetails.status || ''}
              category={`${itemDetails.categoryNbr} - ${itemDetails.categoryDesc}`}
              price={itemDetails.price}
              exceptionType={!actionCompleted ? itemDetails.exceptionType : undefined}
            />
            <SFTCard
              title={strings('ITEM.QUANTITY')}
              iconName="pallet"
              topRightBtnTxt={pendingOnHandsQty === -999 ? strings('GENERICS.CHANGE') : undefined}
              topRightBtnAction={() => handleUpdateQty(props, itemDetails)}
            >
              {renderOHQtyComponent(itemDetails.onHandsQty, pendingOnHandsQty)}
            </SFTCard>
            <SFTCard
              iconProp={(
                <MaterialCommunityIcon
                  name="label-variant"
                  size={20}
                  color={COLOR.GREY_700}
                  style={styles.labelIcon}
                />
              )}
              title={strings('ITEM.REPLENISHMENT')}
            >
              <View style={styles.itemOnOrderView}>
                <Text>{strings('ITEM.ON_ORDER')}</Text>
                <Text>{itemDetails.replenishment.onOrder}</Text>
              </View>
            </SFTCard>
            <SFTCard
              iconName="map-marker-alt"
              title={`${strings('ITEM.LOCATION')}(${locationCount})`}
              topRightBtnTxt={locationCount && locationCount >= 1
                ? strings('GENERICS.SEE_ALL') : strings('GENERICS.ADD')}
              topRightBtnAction={() => handleLocationAction(props, itemDetails)}
            >
              {renderLocationComponent(props, itemDetails)}
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
          )}
      </ScrollView>
      {renderScanForNoActionButton(props, itemDetails)}
    </View>
  );
};
const ReviewItemDetails = (): JSX.Element => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails);
  const addToPicklistStatus = useTypedSelector(state => state.async.addToPicklist);
  const completeItemApi = useTypedSelector(state => state.async.noAction);
  const { userId } = useTypedSelector(state => state.User);
  const { exceptionType, actionCompleted, pendingOnHandsQty } = useTypedSelector(state => state.ItemDetailScreen);
  const { floorLocations, reserveLocations } = useTypedSelector(state => state.Location);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const [isSalesMetricsGraphView, setIsSalesMetricsGraphView] = useState(false);
  const [ohQtyModalVisible, setOhQtyModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiStart, setApiStart] = useState(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  return (
    <ReviewItemDetailsScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      isWaiting={isWaiting}
      error={error}
      result={result}
      addToPicklistStatus={addToPicklistStatus}
      completeItemApi={completeItemApi}
      userId={userId}
      exceptionType={exceptionType}
      actionCompleted={actionCompleted}
      pendingOnHandsQty={pendingOnHandsQty}
      floorLocations={floorLocations}
      reserveLocations={reserveLocations}
      route={route}
      dispatch={dispatch}
      navigation={navigation}
      scrollViewRef={scrollViewRef}
      isSalesMetricsGraphView={isSalesMetricsGraphView}
      setIsSalesMetricsGraphView={setIsSalesMetricsGraphView}
      ohQtyModalVisible={ohQtyModalVisible}
      setOhQtyModalVisible={setOhQtyModalVisible}
      isRefreshing={isRefreshing}
      setIsRefreshing={setIsRefreshing}
      apiStart={apiStart}
      setApiStart={setApiStart}
      errorModalVisible={errorModalVisible}
      setErrorModalVisible={setErrorModalVisible}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
    />
  );
};
export default ReviewItemDetails;
