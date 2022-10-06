import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
  EmitterSubscription,
  RefreshControl, ScrollView, Text, TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import { AxiosError } from 'axios';
import { barcodeEmitter } from '../../../utils/scannerUtils';
import { CustomModalComponent } from '../../Modal/Modal';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import { trackEvent } from '../../../utils/AppCenterTool';
import { validateSession } from '../../../utils/sessionTimeout';
import Location from '../../../models/Location';
import { Configurations } from '../../../models/User';
import ItemDetails from '../../../models/ItemDetails';
import styles from './AuditItem.style';
import ManualScanComponent from '../../../components/manualscan/ManualScan';
import { strings } from '../../../locales';
import COLOR from '../../../themes/Color';
import { resetScannedEvent, setScannedEvent } from '../../../state/actions/Global';

import {
  GET_ITEM_DETAILS
} from '../../../state/actions/asyncAPI';
import {
  getItemDetails
} from '../../../state/actions/saga';

import ItemCard from '../../../components/ItemCard/ItemCard';
import LocationListCard, { LocationList } from '../../../components/LocationListCard/LocationListCard';
import OtherOHItemCard from '../../../components/OtherOHItemCard/OtherOHItemCard';
import { setupScreen } from '../../../state/actions/ItemDetailScreen';
import { AsyncState } from '../../../models/AsyncState';
import {
  setFloorLocations, setItemDetails, setReserveLocations, setScannedPalletId, updatePalletQty
} from '../../../state/actions/AuditItemScreen';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { mockGetItemPalletsAsyncState } from '../../../mockData/getItemPallets';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import PalletQtyUpdate from '../../../components/PalletQtyUpdate/PalletQtyUpdate';

export interface AuditItemScreenProps {
    scannedEvent: { value: string | null; type: string | null; };
    isManualScanEnabled: boolean;
    getItemDetailsApi: AsyncState;
    getLocationApi: AsyncState;
    getItemPalletsApi: AsyncState;
    userId: string;
    floorLocations: Location[];
    reserveLocations: ItemPalletInfo[];
    route: RouteProp<any, string>;
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    scrollViewRef: RefObject<ScrollView>;
    trackEventCall: (eventName: string, params?: any) => void;
    validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
    useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
    useFocusEffectHook: (effect: EffectCallback) => void;
    userFeatures: string[];
    userConfigs: Configurations;
    itemNumber: number;
    showItemNotFoundMsg: boolean;
    setShowItemNotFoundMsg: React.Dispatch<React.SetStateAction<boolean>>;
    itemDetails: ItemDetails | null;
    showPalletQtyUpdateModal: boolean;
    setShowPalletQtyUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
    scannedPalletId: string;
    userConfig: Configurations;
  }

export const isError = (
  error: AxiosError | null,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  itemNumber: number,
  message?: string
) => {
  if (error || message) {
    return (
      <View style={styles.safeAreaView}>
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
          <Text style={styles.errorText}>{strings('ITEM.API_ERROR')}</Text>
          <TouchableOpacity
            testID="errorLoadingItemRetry"
            style={styles.errorButton}
            onPress={() => {
              trackEventCall('item_details_api_retry', { itemNumber });
              return dispatch(getItemDetails({ id: itemNumber }));
            }}
          >
            <Text>{strings('GENERICS.RETRY')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View />
  );
};

export const onValidateItemNumber = (props: AuditItemScreenProps) => {
  const {
    userId, route,
    dispatch, navigation, trackEventCall,
    validateSessionCall, itemNumber
  } = props;

  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name).then(() => {
      if (itemNumber > 0) {
        dispatch({ type: GET_ITEM_DETAILS.RESET });
        dispatch(getItemDetails({ id: itemNumber }));
      }
    }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
  }
};

export const addLocationHandler = (
  itemDetails: ItemDetails | null,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  dispatch(setupScreen(
    itemDetails ? itemDetails.itemNbr : 0,
    itemDetails ? itemDetails.upcNbr : '',
    itemDetails?.location.floor || [],
    itemDetails?.location.reserve || [],
    null,
    -999,
    false,
    false
  ));
  navigation.navigate('AddLocation');
};

export const getlocationsApiResult = (locationsApi: AsyncState, dispatch: Dispatch<any>) => {
  const locDetails = (locationsApi.result && locationsApi.result.data);
  if (locDetails.location && locDetails.location.floor) {
    dispatch(setFloorLocations(locDetails.location.floor));
  }
};

export const getItemDetailsApiHook = (
  getItemDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowItemNotFoundMsg: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.result) {
      if (getItemDetailsApi.result.status === 200 || getItemDetailsApi.result.status === 207) {
        const itemDetails: ItemDetails = getItemDetailsApi.result.data;
        dispatch(setItemDetails(itemDetails));
        dispatch(setFloorLocations(itemDetails.location.floor || []));
        setShowItemNotFoundMsg(false);
      } else if (getItemDetailsApi.result.status === 204) {
        setShowItemNotFoundMsg(true);
        Toast.show({
          type: 'error',
          text1: strings('ITEM.ITEM_NOT_FOUND'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      }
      dispatch({ type: GET_ITEM_DETAILS.RESET });
    }
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.error) {
      setShowItemNotFoundMsg(false);
    }
  }
};

// TODO: getItemPalletsApiHoook has to be updated after real APi integration
export const getItemPalletsApiHook = (
  getItemPalletsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemPalletsApi.isWaiting && getItemPalletsApi.result) {
      if (getItemPalletsApi.result.status === 200) {
        const { data } = getItemPalletsApi.result;
        dispatch(setReserveLocations(data.pallets));
      }
    }
  }
};

export const getScannedPalletEffect = (
  navigation: NavigationProp<any>,
  scannedEvent: { type: string | null; value: string | null },
  reserveLocations: ItemPalletInfo[],
  dispatch: Dispatch<any>,
  setShowPalletQtyUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused() && scannedEvent.value) {
    const matchedPallet = reserveLocations.find(loc => loc.palletId === scannedEvent.value);
    if (matchedPallet) {
      setShowPalletQtyUpdateModal(true);
      dispatch(setScannedPalletId(scannedEvent.value));
    } else {
      Toast.show({
        type: 'error',
        text1: strings('AUDITS.SCAN_PALLET_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    }
    dispatch(resetScannedEvent());
  }
};

export const renderpalletQtyUpdateModal = (
  palletId: string,
  reserveLocations: ItemPalletInfo[],
  dispatch: Dispatch<any>,
  showPalletQtyUpdateModal: boolean,
  setShowPalletQtyUpdateModal: React.Dispatch<React.SetStateAction<boolean>>,
  vendorPackQty?: number
) => {
  const palletInfo = reserveLocations.find(pallet => pallet.palletId === palletId);
  const qty = palletInfo?.quantity === vendorPackQty ? palletInfo?.quantity : 0;
  const newPalletQty = palletInfo?.newQty;
  return (
    <CustomModalComponent
      isVisible={showPalletQtyUpdateModal}
      onClose={() => setShowPalletQtyUpdateModal(false)}
      modalType="Form"
    >
      <PalletQtyUpdate
        palletId={palletId}
        qty={newPalletQty || qty || 0}
        handleClose={() => {
          setShowPalletQtyUpdateModal(false);
        }}
        handleSubmit={(newQty: number) => {
          dispatch(updatePalletQty(palletId, newQty));
          setShowPalletQtyUpdateModal(false);
        }}
      />
    </CustomModalComponent>
  );
};

export const AuditItemScreen = (props: AuditItemScreenProps): JSX.Element => {
  const {
    scannedEvent, isManualScanEnabled,
    getLocationApi,
    getItemDetailsApi,
    userId,
    route,
    dispatch,
    navigation,
    scrollViewRef,
    trackEventCall,
    validateSessionCall,
    useEffectHook,
    itemNumber,
    setShowItemNotFoundMsg,
    showItemNotFoundMsg,
    itemDetails,
    floorLocations,
    reserveLocations,
    getItemPalletsApi,
    setShowPalletQtyUpdateModal,
    showPalletQtyUpdateModal,
    scannedPalletId,
    userConfig
  } = props;
  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused() && userConfig.scanRequired) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall('section_details_scan', { value: scan.value, type: scan.type });
          dispatch(setScannedEvent(scan));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  useEffectHook(() => getScannedPalletEffect(
    navigation, scannedEvent, reserveLocations, dispatch, setShowPalletQtyUpdateModal
  ), [scannedEvent]);

  // call get Item details
  useEffectHook(() => {
    onValidateItemNumber(props);
  }, [itemNumber]);

  // Scanned Item Event Listener
  useEffectHook(() => {
    // TO DO
  }, [scannedEvent]);

  // Get Location Details API
  useEffectHook(() => {
    if (!getLocationApi.isWaiting && getLocationApi.result && getLocationApi.value?.itemNbr === itemNumber) {
      getlocationsApiResult(getLocationApi, dispatch);
    }
  }, [getLocationApi]);

  // Get Item Details UPC api
  useEffectHook(
    () => getItemDetailsApiHook(getItemDetailsApi, dispatch, navigation, setShowItemNotFoundMsg),
    [getItemDetailsApi]
  );

  // Get Pallets api
  useEffectHook(
    () => getItemPalletsApiHook(getItemPalletsApi, dispatch, navigation),
    [getItemPalletsApi]
  );

  if (!getItemDetailsApi.isWaiting && (getItemDetailsApi.error || (itemDetails && itemDetails.message))) {
    const message = (itemDetails && itemDetails.message) ? itemDetails.message : undefined;
    return isError(
      getItemDetailsApi.error,
      dispatch,
      trackEventCall,
      itemNumber,
      message
    );
  }

  if (showItemNotFoundMsg) {
    return (
      <View style={styles.safeAreaView}>
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
          <Text style={styles.errorText}>{strings('PALLET.ITEMS_NOT_FOUND')}</Text>
        </View>
      </View>
    );
  }

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall('refresh_item_details', { itemNumber });
      dispatch({ type: GET_ITEM_DETAILS.RESET });
      dispatch(getItemDetails({ id: itemNumber }));
    }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
  };

  const getFloorLocationList = (locations: Location[]) => {
    const locationLst: LocationList[] = [];
    if (locations && locations.length) {
      locations.forEach(loc => {
        locationLst.push({
          sectionId: loc.sectionId,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`,
          quantity: loc.qty ? loc.qty : 0,
          palletId: '',
          increment: () => {},
          decrement: () => {},
          onDelete: () => {},
          qtyChange: () => {}
        });
      });
    }
    return locationLst;
  };

  const getReserveLocationList = (locations: ItemPalletInfo[]) => {
    const locationLst: LocationList[] = [];
    if (locations && locations.length) {
      locations.forEach(loc => {
        locationLst.push({
          sectionId: loc.sectionId,
          locationName: loc.locationName,
          quantity: loc.newQty || loc.quantity,
          scanned: loc.scanned,
          palletId: loc.palletId,
          increment: () => {},
          decrement: () => {},
          onDelete: () => {},
          qtyChange: () => {}
        });
      });
    }
    return locationLst;
  };

  return (
    <>
      {renderpalletQtyUpdateModal(
        scannedPalletId,
        reserveLocations,
        dispatch,
        showPalletQtyUpdateModal,
        setShowPalletQtyUpdateModal,
        itemDetails?.vendorPackQty
      )}
      {isManualScanEnabled && <ManualScanComponent placeholder={strings('LOCATION.PALLET')} />}
      <View style={{ marginBottom: 8 }}>
        <ItemCard
          itemNumber={itemDetails ? itemDetails.itemNbr : 0}
          description={itemDetails ? itemDetails.itemName : ''}
          imageUrl={undefined}
          onHandQty={itemDetails ? itemDetails.onHandsQty : 0}
          onClick={() => { }}
          loading={getItemDetailsApi.isWaiting}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        nestedScrollEnabled={true}
        refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
      >
        <View
          style={styles.container}
        >
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getFloorLocationList(floorLocations)}
              locationType="floor"
              add={() => addLocationHandler(
                itemDetails,
                dispatch,
                navigation
              )}
              loading={getItemDetailsApi.isWaiting || getLocationApi.isWaiting}
              error={!!(getItemDetailsApi.error || getLocationApi.error)}
              onRetry={() => { }}
              scanRequired={userConfig.scanRequired}
            />
          </View>
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getReserveLocationList(reserveLocations)}
              locationType="reserve"
              loading={getItemPalletsApi.isWaiting}
              error={!!getItemPalletsApi.error}
              onRetry={() => { }}
              scanRequired={userConfig.scanRequired}
            />
          </View>
          <View style={styles.marginBottomStyle}>
            <OtherOHItemCard
              flyCloudInTransitOH={5}
              flyCloudOH={3}
              claimsOH={5}
              consolidatorOH={2}
              loading={getItemDetailsApi.isWaiting}
              collapsed={false}
            />
          </View>
        </View>
      </ScrollView>

    </>
  );
};

const AuditItem = (): JSX.Element => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const getLocationApi = useTypedSelector(state => state.async.getLocation);
  const userConfig = useTypedSelector(state => state.User.configs);
  // TODO: Below mock state needs to be replaced with async state
  const getItemPalletsApi = mockGetItemPalletsAsyncState;
  const { userId } = useTypedSelector(state => state.User);
  const userFeatures = useTypedSelector(state => state.User.features);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const itemNumber = useTypedSelector(state => state.AuditWorklist.itemNumber);
  const [showItemNotFoundMsg, setShowItemNotFoundMsg] = useState(false);
  const {
    itemDetails, floorLocations, reserveLocations, scannedPalletId
  } = useTypedSelector(state => state.AuditItemScreen);
  const [showPalletQtyUpdateModal, setShowPalletQtyUpdateModal] = useState(false);

  return (
    <AuditItemScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      getItemDetailsApi={getItemDetailsApi}
      getItemPalletsApi={getItemPalletsApi}
      getLocationApi={getLocationApi}
      route={route}
      dispatch={dispatch}
      navigation={navigation}
      scrollViewRef={scrollViewRef}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
      userFeatures={userFeatures}
      userConfigs={userConfigs}
      userId={userId}
      itemNumber={itemNumber}
      showItemNotFoundMsg={showItemNotFoundMsg}
      setShowItemNotFoundMsg={setShowItemNotFoundMsg}
      itemDetails={itemDetails}
      floorLocations={floorLocations}
      reserveLocations={reserveLocations}
      showPalletQtyUpdateModal={showPalletQtyUpdateModal}
      setShowPalletQtyUpdateModal={setShowPalletQtyUpdateModal}
      scannedPalletId={scannedPalletId}
      userConfig={userConfig}
    />
  );
};

export default AuditItem;
