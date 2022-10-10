import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator,
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

import {
  DELETE_LOCATION,
  GET_ITEM_DETAILS,
  GET_ITEM_PALLETS,
  REPORT_MISSING_PALLET
} from '../../../state/actions/asyncAPI';
import {
  deleteLocation,
  getItemDetails, getLocationDetails,
  getItemPallets,
  reportMissingPallet
} from '../../../state/actions/saga';

import ItemCard from '../../../components/ItemCard/ItemCard';
import LocationListCard, { LocationList } from '../../../components/LocationListCard/LocationListCard';
import OtherOHItemCard from '../../../components/OtherOHItemCard/OtherOHItemCard';
import { setupScreen } from '../../../state/actions/ItemDetailScreen';
import { AsyncState } from '../../../models/AsyncState';
import { setFloorLocations, setItemDetails, setReserveLocations } from '../../../state/actions/AuditItemScreen';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import Button from '../../../components/buttons/Button';

export interface AuditItemScreenProps {
    scannedEvent: { value: string | null; type: string | null; };
    isManualScanEnabled: boolean;
    getItemDetailsApi: AsyncState;
    getLocationApi: AsyncState;
    getItemPalletsApi: AsyncState;
    deleteFloorLocationApi: AsyncState;
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
    showDeleteConfirmationModal: boolean;
    setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
    locToConfirm: {
      locationName: string;
      locationArea: string;
      locationIndex: number;
      locationTypeNbr: number;
      palletId: string;
      sectionId: number;
    };
    setLocToConfirm: React.Dispatch<React.SetStateAction<{
      locationName: string;
      locationArea: string;
      locationIndex: number;
      locationTypeNbr: number;
      palletId: string;
      sectionId: number;
    }>>;
    reportMissingPalletApi: AsyncState;
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
        dispatch({ type: GET_ITEM_PALLETS.RESET });
        dispatch(getItemPallets({ itemNbr: itemNumber }));
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

export const getLocationsApiHook = (
  getLocationApi: AsyncState,
  itemNumber: number,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
) => {
  if (navigation.isFocused()) {
    if (!getLocationApi.isWaiting && getLocationApi.result && getLocationApi.value?.itemNbr === itemNumber) {
      getlocationsApiResult(getLocationApi, dispatch);
    }
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

export const deleteFloorLocationApiHook = (
  deleteFloorLocationApi: AsyncState,
  itemNbr: number,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  locationName: string
) => {
  if (navigation.isFocused()) {
    if (!deleteFloorLocationApi.isWaiting && deleteFloorLocationApi.result) {
      setShowDeleteConfirmationModal(false);
      if (deleteFloorLocationApi.result.status === 200) {
        Toast.show({
          type: 'success',
          text1: strings('LOCATION.DELETE_LOCATION_API_SUCCESS', { locationName }),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
        dispatch(getLocationDetails({ itemNbr }));
        dispatch({ type: DELETE_LOCATION.RESET });
      }
    } else if (!deleteFloorLocationApi.isWaiting && deleteFloorLocationApi.error) {
      setShowDeleteConfirmationModal(false);
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.DELETE_LOCATION_API_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      dispatch({ type: DELETE_LOCATION.RESET });
    }
  }
};

export const reportMissingPalletApiHook = (
  reportMissingPalletApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  palletId: string
) => {
  if (navigation.isFocused()) {
    if (!reportMissingPalletApi.isWaiting && reportMissingPalletApi.result) {
      setShowDeleteConfirmationModal(false);
      if (reportMissingPalletApi.result.status === 200) {
        Toast.show({
          type: 'success',
          text1: strings('WORKLIST.MISSING_PALLET_API_SUCCESS', { palletId }),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
        // dispatch(getLocationDetails({ 0 }));
        dispatch({ type: REPORT_MISSING_PALLET.RESET });
      }
    } else if (!reportMissingPalletApi.isWaiting && reportMissingPalletApi.error) {
      setShowDeleteConfirmationModal(false);
      Toast.show({
        type: 'error',
        text1: strings('WORKLIST.MISSING_PALLET_API_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      dispatch({ type: REPORT_MISSING_PALLET.RESET });
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

export const renderDeleteLocationModal = (
  deleteFloorLocationApi: AsyncState,
  reportMissingPalletApi: AsyncState,
  showDeleteConfirmationModal: boolean,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  deleteLocationConfirmed: (locType: string) => void,
  locationName: string,
  locationType: string,
  palletId: string
) => (
  <CustomModalComponent
    isVisible={showDeleteConfirmationModal}
    onClose={() => setShowDeleteConfirmationModal(false)}
    modalType="Error"
  >
    {deleteFloorLocationApi.isWaiting || reportMissingPalletApi.isWaiting ? (
      <ActivityIndicator
        animating={deleteFloorLocationApi.isWaiting || reportMissingPalletApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    ) : (
      <>
        <Text style={styles.message}>
          {locationType === 'floor' && deleteFloorLocationApi.error
            ? strings('LOCATION.DELETE_LOCATION_API_ERROR')
            : `${strings('LOCATION.DELETE_CONFIRMATION')}${locationName
            }`}
          {locationType === 'reserve' && reportMissingPalletApi.error
            ? strings('WORKLIST.MISSING_PALLET_API_ERROR')
            : `${strings('WORKLIST.MISSING_PALLET_CONFIRMATION')}${palletId
            }`}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title={strings('GENERICS.CANCEL')}
            backgroundColor={COLOR.MAIN_THEME_COLOR}
            testID="modal-cancel-button"
            onPress={() => setShowDeleteConfirmationModal(false)}
          />
          <Button
            style={styles.button}
            title={deleteFloorLocationApi.error || reportMissingPalletApi.error
              ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
            testID="modal-confirm-button"
            backgroundColor={COLOR.TRACKER_RED}
            onPress={() => deleteLocationConfirmed(locationType)}
          />
        </View>
      </>
    )}
  </CustomModalComponent>
);

export const AuditItemScreen = (props: AuditItemScreenProps): JSX.Element => {
  const {
    scannedEvent, isManualScanEnabled,
    getLocationApi,
    getItemDetailsApi,
    deleteFloorLocationApi,
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
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
    locToConfirm,
    setLocToConfirm,
    reportMissingPalletApi
  } = props;

  // call get Item details
  useEffectHook(() => {
    onValidateItemNumber(props);
  }, [itemNumber]);

  // Scanned Item Event Listener
  useEffectHook(() => {
    // TO DO
  }, [scannedEvent]);

  // Get Location Details API
  useEffectHook(
    () => getLocationsApiHook(getLocationApi, itemNumber, dispatch, navigation),
    [getLocationApi]
  );

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

  // Delete Location API
  useEffectHook(
    () => deleteFloorLocationApiHook(
      deleteFloorLocationApi, itemNumber, dispatch, navigation,
      setShowDeleteConfirmationModal, locToConfirm.locationName
    ),
    [deleteFloorLocationApi]
  );

  // report missing pallet API
  useEffectHook(
    () => reportMissingPalletApiHook(
      reportMissingPalletApi, dispatch, navigation,
      setShowDeleteConfirmationModal, locToConfirm.palletId
    ),
    [reportMissingPalletApi]
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
      dispatch({ type: GET_ITEM_PALLETS.RESET });
      dispatch(getItemPallets({ itemNbr: itemNumber }));
    }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
  };

  const deleteLocationConfirmed = (locType: string) => {
    if (locType === 'reserve') {
      dispatch(
        deleteLocation({
          headers: { itemNumber },
          upc: itemDetails?.upcNbr || '',
          sectionId: locToConfirm.locationName,
          locationTypeNbr: locToConfirm.locationTypeNbr
        }),
      );
    } else {
      dispatch(
        reportMissingPallet({
          palletId: locToConfirm.palletId,
          locationName: locToConfirm.locationName,
          sectionId: locToConfirm.sectionId
        }),
      );
    }
  };

  const handleReserveLocsRetry = () => {
    dispatch({ type: GET_ITEM_PALLETS.RESET });
    dispatch(getItemPallets({ itemNbr: itemNumber }));
  };

  const handleDeleteLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('audit_delete_floor_location_click', { location: JSON.stringify(loc), index: locIndex });
      setLocToConfirm({
        locationName: loc.locationName,
        locationArea: 'floor',
        locationIndex: locIndex,
        locationTypeNbr: loc.typeNbr,
        palletId: '',
        sectionId: 0
      });
      setShowDeleteConfirmationModal(true);
    }).catch(() => { });
  };

  const handleDeleteReserveLocation = (loc: ItemPalletInfo, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('audit_delete_reserve_location_click', { location: JSON.stringify(loc), index: locIndex });
      setLocToConfirm({
        locationName: loc.locationName,
        locationArea: 'reserve',
        locationIndex: locIndex,
        locationTypeNbr: 0,
        palletId: loc.palletId,
        sectionId: loc.sectionId
      });
      setShowDeleteConfirmationModal(true);
    }).catch(() => { });
  };

  const getFloorLocationList = (locations: Location[]) => {
    const locationLst: LocationList[] = [];
    if (locations && locations.length) {
      locations.forEach((loc: Location, index: number) => {
        locationLst.push({
          sectionId: loc.sectionId,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`,
          quantity: loc.qty ? loc.qty : 0,
          palletId: '',
          increment: () => {},
          decrement: () => {},
          onDelete: () => handleDeleteLocation(loc, index),
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
          quantity: loc.quantity,
          palletId: loc.palletId,
          increment: () => {},
          decrement: () => {},
          onDelete: () => handleDeleteReserveLocation(loc, index),
          qtyChange: () => {}
        });
      });
    }
    return locationLst;
  };

  return (
    <>
      {renderDeleteLocationModal(
        deleteFloorLocationApi,
        reportMissingPalletApi,
        showDeleteConfirmationModal,
        setShowDeleteConfirmationModal,
        deleteLocationConfirmed,
        locToConfirm.locationName,
        locToConfirm.locationArea,
        locToConfirm.palletId
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
              scanRequired={false}
            />
          </View>
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getReserveLocationList(reserveLocations)}
              locationType="reserve"
              loading={getItemPalletsApi.isWaiting}
              error={!!getItemPalletsApi.error}
              onRetry={handleReserveLocsRetry}
              scanRequired={false}
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
  const deleteFloorLocationApi = useTypedSelector(state => state.async.deleteLocation);
  const reportMissingPalletApi = useTypedSelector(state => state.async.reportMissingPallet);
  // TODO: Below mock state needs to be replaced with async state
  const getItemPalletsApi = useTypedSelector(state => state.async.getItemPallets);
  const { userId } = useTypedSelector(state => state.User);
  const userFeatures = useTypedSelector(state => state.User.features);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const itemNumber = useTypedSelector(state => state.AuditWorklist.itemNumber);
  const [showItemNotFoundMsg, setShowItemNotFoundMsg] = useState(false);
  const { itemDetails, floorLocations, reserveLocations } = useTypedSelector(state => state.AuditItemScreen);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '', locationArea: '', locationIndex: -1, locationTypeNbr: -1, palletId: '', sectionId: 0
  });

  return (
    <AuditItemScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      getItemDetailsApi={getItemDetailsApi}
      getItemPalletsApi={getItemPalletsApi}
      deleteFloorLocationApi={deleteFloorLocationApi}
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
      showDeleteConfirmationModal={showDeleteConfirmationModal}
      setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
      locToConfirm={locToConfirm}
      setLocToConfirm={setLocToConfirm}
      reportMissingPalletApi={reportMissingPalletApi}
    />
  );
};

export default AuditItem;
