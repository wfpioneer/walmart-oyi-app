import React, {
  EffectCallback,
  RefObject,
  createRef,
  useEffect,
  useState
} from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import { AxiosError } from 'axios';
import moment from 'moment';
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
import { currencies, strings } from '../../../locales';
import COLOR from '../../../themes/Color';
import {
  resetScannedEvent,
  setScannedEvent
} from '../../../state/actions/Global';
import AuditScreenFooter from '../../../components/AuditScreenFooter/AuditScreenFooter';

import {
  DELETE_LOCATION,
  GET_ITEM_DETAILS,
  GET_ITEM_PALLETS,
  NO_ACTION,
  UPDATE_OH_QTY
} from '../../../state/actions/asyncAPI';
import {
  deleteLocation,
  getItemDetails,
  getItemPallets,
  getLocationDetails,
  noAction,
  updateOHQty
} from '../../../state/actions/saga';

import ItemCard from '../../../components/ItemCard/ItemCard';
import LocationListCard, {
  LocationList
} from '../../../components/LocationListCard/LocationListCard';
import OtherOHItemCard from '../../../components/OtherOHItemCard/OtherOHItemCard';
import { setupScreen } from '../../../state/actions/ItemDetailScreen';
import { AsyncState } from '../../../models/AsyncState';
import {
  clearAuditScreenData,
  setFloorLocations,
  setItemDetails,
  setReserveLocations,
  setScannedPalletId,
  updatePalletQty
} from '../../../state/actions/AuditItemScreen';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import PalletQtyUpdate from '../../../components/PalletQtyUpdate/PalletQtyUpdate';
import Button from '../../../components/buttons/Button';
import { UseStateType } from '../../../models/Generics.d';
import { approvalRequestSource } from '../../../models/ApprovalListItem';

export interface AuditItemScreenProps {
  scannedEvent: { value: string | null; type: string | null };
  isManualScanEnabled: boolean;
  getItemDetailsApi: AsyncState;
  getLocationApi: AsyncState;
  getItemPalletsApi: AsyncState;
  deleteFloorLocationApi: AsyncState;
  updateOHQtyApi: AsyncState;
  completeItemApi: AsyncState;
  userId: string;
  floorLocations: Location[];
  reserveLocations: ItemPalletInfo[];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  scrollViewRef: RefObject<ScrollView>;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (
    navigation: NavigationProp<any>,
    route?: string
  ) => Promise<void>;
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
  showDeleteConfirmationModal: boolean;
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  locToConfirm: {
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
  };
  setLocToConfirm: React.Dispatch<
    React.SetStateAction<{
      locationName: string;
      locationArea: string;
      locationIndex: number;
      locationTypeNbr: number;
    }>
  >;
  showOnHandsConfirmState: UseStateType<boolean>;
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
  return <View />;
};

export const onValidateItemNumber = (props: AuditItemScreenProps) => {
  const {
    userId,
    route,
    dispatch,
    navigation,
    trackEventCall,
    validateSessionCall,
    itemNumber
  } = props;

  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name)
      .then(() => {
        if (itemNumber > 0) {
          dispatch({ type: GET_ITEM_DETAILS.RESET });
          dispatch(getItemDetails({ id: itemNumber }));
          dispatch(getItemPallets({ itemNbr: itemNumber }));
        }
      })
      .catch(() => {
        trackEventCall('session_timeout', { user: userId });
      });
  }
};

export const addLocationHandler = (
  itemDetails: ItemDetails | null,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  dispatch(
    setupScreen(
      itemDetails ? itemDetails.itemNbr : 0,
      itemDetails ? itemDetails.upcNbr : '',
      itemDetails?.location.floor || [],
      itemDetails?.location.reserve || [],
      null,
      -999,
      false,
      false
    )
  );
  navigation.navigate('AddLocation');
};

export const getlocationsApiResult = (
  locationsApi: AsyncState,
  dispatch: Dispatch<any>
) => {
  const locDetails = locationsApi.result && locationsApi.result.data;
  if (locDetails.location && locDetails.location.floor) {
    dispatch(setFloorLocations(locDetails.location.floor));
  }
};

export const getLocationsApiHook = (
  getLocationApi: AsyncState,
  itemNumber: number,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    if (
      !getLocationApi.isWaiting &&
      getLocationApi.result &&
      getLocationApi.value?.itemNbr === itemNumber
    ) {
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
      if (
        getItemDetailsApi.result.status === 200 ||
        getItemDetailsApi.result.status === 207
      ) {
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
          text1: strings('LOCATION.DELETE_LOCATION_API_SUCCESS', {
            locationName
          }),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
        dispatch(getLocationDetails({ itemNbr }));
        dispatch({ type: DELETE_LOCATION.RESET });
      }
    } else if (
      !deleteFloorLocationApi.isWaiting &&
      deleteFloorLocationApi.error
    ) {
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

export const getItemPalletsApiHook = (
  getItemPalletsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemPalletsApi.isWaiting && getItemPalletsApi.result) {
      if (getItemPalletsApi.result.status === 200) {
        const { data } = getItemPalletsApi.result;
        dispatch(setReserveLocations(data.pallets));
        dispatch({ type: GET_ITEM_PALLETS.RESET });
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
    const matchedPallet = reserveLocations.find(
      loc => loc.palletId === scannedEvent.value
    );
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
  const palletInfo = reserveLocations.find(
    pallet => pallet.palletId === palletId
  );
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

export const completeItemApiHook = (
  completeItemApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    if (!completeItemApi.isWaiting && completeItemApi.error) {
      Toast.show({
        type: 'error',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      dispatch({ type: NO_ACTION.RESET });
    }
    if (!completeItemApi.isWaiting && completeItemApi.result) {
      Toast.show({
        type: 'success',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      dispatch({ type: NO_ACTION.RESET });
      navigation.goBack();
    }
  }
};

export const updateOHQtyApiHook = (
  updateOHQtyApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowOnHandsConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused()) {
    if (!updateOHQtyApi.isWaiting && updateOHQtyApi.result) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      dispatch({ type: UPDATE_OH_QTY.RESET });
      setShowOnHandsConfirmationModal(false);
      navigation.goBack();
    }
    if (!updateOHQtyApi.isWaiting && updateOHQtyApi.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }
  }
};

export const calculateTotalOHQty = (
  floorLocations: Location[],
  reserveLocations: ItemPalletInfo[],
  itemDetails: ItemDetails | null
) => {
  const floorLocationsCount = floorLocations.reduce(
    (acc: number, loc: Location) => {
      const qty = typeof loc.newQty === 'number' ? loc.newQty : loc.qty;
      return acc + (qty || 0);
    },
    0
  );
  const reserveLocationsCount = reserveLocations.reduce(
    (acc: number, loc: ItemPalletInfo) => {
      const qty = typeof loc.newQty === 'number' ? loc.newQty : loc.quantity;
      return acc + (qty || 0);
    },
    0
  );
  const otherOHTotalCount =
    (itemDetails?.claimsOnHandQty || 0) +
    (itemDetails?.inTransitCloudQty || 0) +
    (itemDetails?.cloudQty || 0) +
    (itemDetails?.consolidatedOnHandQty || 0);
  return floorLocationsCount + reserveLocationsCount + otherOHTotalCount;
};

const qtyStyleChange = (
  oldQty: number,
  newQty: number
): Record<string, unknown> => {
  if (newQty > oldQty) {
    return styles.positiveChange;
  }
  return styles.negativeChange;
};

export const renderDeleteLocationModal = (
  deleteFloorLocationApi: AsyncState,
  showDeleteConfirmationModal: boolean,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  deleteLocationConfirmed: () => void,
  locationName: string
) => (
  <CustomModalComponent
    isVisible={showDeleteConfirmationModal}
    onClose={() => setShowDeleteConfirmationModal(false)}
    modalType="Error"
  >
    {deleteFloorLocationApi.isWaiting ? (
      <ActivityIndicator
        animating={deleteFloorLocationApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    ) : (
      <>
        <Text style={styles.message}>
          {deleteFloorLocationApi.error
            ? strings('LOCATION.DELETE_LOCATION_API_ERROR')
            : `${strings('LOCATION.DELETE_CONFIRMATION')}${locationName}`}
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
            title={
              deleteFloorLocationApi.error
                ? strings('GENERICS.RETRY')
                : strings('GENERICS.OK')
            }
            testID="modal-confirm-button"
            backgroundColor={COLOR.TRACKER_RED}
            onPress={deleteLocationConfirmed}
          />
        </View>
      </>
    )}
  </CustomModalComponent>
);

export const renderConfirmOnHandsModal = (
  updateOHQtyApi: AsyncState,
  showOnHandsConfirmationModal: boolean,
  setShowOnHandsConfirmationModal: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  updatedQuantity: number,
  itemDetails: ItemDetails | null,
  dispatch: Dispatch<any>
) => {
  const onHandsQty = itemDetails?.onHandsQty || 0;
  const basePrice = itemDetails?.basePrice || 0;
  const changeQuantity = updatedQuantity - onHandsQty;
  const priceChange = basePrice * changeQuantity;
  const priceLimit = 1000.0;
  return (
    <CustomModalComponent
      isVisible={showOnHandsConfirmationModal}
      onClose={() => setShowOnHandsConfirmationModal(false)}
      modalType="Popup"
      minHeight={150}
    >
      {updateOHQtyApi.isWaiting ? (
        <ActivityIndicator
          animating={updateOHQtyApi.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
          {Math.abs(priceChange) > priceLimit && (
            <MaterialCommunityIcon
              name="alert"
              size={40}
              color={COLOR.ORANGE}
            />
          )}
          <Text style={styles.confirmText}>
            {strings('AUDITS.CONFIRM_AUDIT')}
          </Text>
          {Math.abs(priceChange) > priceLimit && (
            <Text>{strings('AUDITS.LARGE_CURRENCY_CHANGE')}</Text>
          )}
          <View style={styles.modalQuantityRow}>
            <Text style={styles.rowQuantityTitle}>
              {strings('APPROVAL.CURRENT_QUANTITY')}
            </Text>
            <Text style={styles.rowQuantity}>{onHandsQty}</Text>
          </View>
          <View style={styles.modalQuantityRow}>
            <Text style={styles.rowQuantityTitle}>
              {strings('GENERICS.CHANGE')}
            </Text>
            <Text style={qtyStyleChange(onHandsQty, updatedQuantity)}>
              <MaterialCommunityIcon
                name={
                  updatedQuantity > onHandsQty
                    ? 'arrow-up-bold'
                    : 'arrow-down-bold'
                }
                size={16}
              />
              {currencies(priceChange)}
            </Text>
            <Text style={qtyStyleChange(onHandsQty, updatedQuantity)}>
              {changeQuantity}
            </Text>
          </View>
          <View style={styles.updatedQtyRow}>
            <Text style={styles.rowQuantityTitle}>
              {strings('AUDITS.UPDATED_QTY')}
            </Text>
            <Text style={styles.rowQuantity}>{updatedQuantity}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              title={strings('APPROVAL.GO_BACK')}
              titleColor={COLOR.MAIN_THEME_COLOR}
              testID="modal-cancel-button"
              onPress={() => setShowOnHandsConfirmationModal(false)}
              type={2}
            />
            <Button
              style={styles.button}
              title={strings('GENERICS.SUBMIT')}
              testID="modal-confirm-button"
              backgroundColor={COLOR.MAIN_THEME_COLOR}
              onPress={() => {
                dispatch(
                  updateOHQty({
                    data: {
                      ...itemDetails,
                      approvalRequestSource: approvalRequestSource.Audits,
                      categoryNbr: itemDetails?.categoryNbr,
                      dollarChange: priceChange,
                      initiatedTimestamp: moment().toISOString(),
                      itemName: itemDetails?.itemName,
                      itemNbr: itemDetails?.itemNbr,
                      newQuantity: updatedQuantity,
                      oldQuantity: onHandsQty,
                      upcNbr: parseInt(itemDetails?.upcNbr || '0', 10)
                    }
                  })
                );
              }}
              disabled={itemDetails === null}
            />
          </View>
        </>
      )}
    </CustomModalComponent>
  );
};
export const disabledContinue = (
  floorLocations: Location[],
  reserveLocations: ItemPalletInfo[],
  scanRequired: boolean
): boolean =>
  floorLocations.some(loc => (loc.newQty || loc.qty || 0) < 1) ||
  reserveLocations.some(
    loc =>
      (scanRequired && !loc.scanned) || (loc.newQty || loc.quantity || -1) < 0
  );

export const AuditItemScreen = (props: AuditItemScreenProps): JSX.Element => {
  const {
    scannedEvent,
    isManualScanEnabled,
    getLocationApi,
    getItemDetailsApi,
    deleteFloorLocationApi,
    updateOHQtyApi,
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
    userConfig,
    completeItemApi,
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
    locToConfirm,
    setLocToConfirm,
    showOnHandsConfirmState
  } = props;
  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused() && userConfig.scanRequired) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall('section_details_scan', {
            value: scan.value,
            type: scan.type
          });
          dispatch(setScannedEvent(scan));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  useEffectHook(
    () =>
      getScannedPalletEffect(
        navigation,
        scannedEvent,
        reserveLocations,
        dispatch,
        setShowPalletQtyUpdateModal
      ),
    [scannedEvent]
  );

  const [showOnHandsConfirmationModal, setShowOnHandsConfirmationModal] =
    showOnHandsConfirmState;
  const totalOHQty = calculateTotalOHQty(
    floorLocations,
    reserveLocations,
    itemDetails
  );

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
    () =>
      getItemDetailsApiHook(
        getItemDetailsApi,
        dispatch,
        navigation,
        setShowItemNotFoundMsg
      ),
    [getItemDetailsApi]
  );

  // Get Pallets api
  useEffectHook(
    () => getItemPalletsApiHook(getItemPalletsApi, dispatch, navigation),
    [getItemPalletsApi]
  );

  // Complete Item API
  useEffectHook(
    () => completeItemApiHook(completeItemApi, dispatch, navigation),
    [completeItemApi]
  );

  // Delete Location API
  useEffectHook(
    () =>
      deleteFloorLocationApiHook(
        deleteFloorLocationApi,
        itemNumber,
        dispatch,
        navigation,
        setShowDeleteConfirmationModal,
        locToConfirm.locationName
      ),
    [deleteFloorLocationApi]
  );

  // Update OH quantity API
  useEffectHook(() =>
    updateOHQtyApiHook(
      updateOHQtyApi,
      dispatch,
      navigation,
      setShowOnHandsConfirmationModal
    )
  );

  if (
    !getItemDetailsApi.isWaiting &&
    (getItemDetailsApi.error || (itemDetails && itemDetails.message))
  ) {
    const message =
      itemDetails && itemDetails.message ? itemDetails.message : undefined;
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
          <MaterialCommunityIcon
            name="information"
            size={40}
            color={COLOR.DISABLED_BLUE}
          />
          <Text style={styles.errorText}>
            {strings('PALLET.ITEMS_NOT_FOUND')}
          </Text>
        </View>
      </View>
    );
  }

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name)
      .then(() => {
        trackEventCall('refresh_item_details', { itemNumber });
        dispatch(clearAuditScreenData());
        dispatch({ type: GET_ITEM_DETAILS.RESET });
        dispatch(getItemDetails({ id: itemNumber }));
        dispatch(getItemPallets({ itemNbr: itemNumber }));
      })
      .catch(() => {
        trackEventCall('session_timeout', { user: userId });
      });
  };

  const handleReserveLocsRetry = () => {
    dispatch({ type: GET_ITEM_PALLETS.RESET });
    dispatch(getItemPallets({ itemNbr: itemNumber }));
  };

  const deleteLocationConfirmed = () => {
    dispatch(
      deleteLocation({
        headers: { itemNumber },
        upc: itemDetails?.upcNbr || '',
        sectionId: locToConfirm.locationName,
        locationTypeNbr: locToConfirm.locationTypeNbr
      })
    );
  };

  const handleDeleteLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation, route.name)
      .then(() => {
        trackEvent('audit_delete_floor_location_click', {
          location: JSON.stringify(loc),
          index: locIndex
        });
        setLocToConfirm({
          locationName: loc.locationName,
          locationArea: 'floor',
          locationIndex: locIndex,
          locationTypeNbr: loc.typeNbr
        });
        setShowDeleteConfirmationModal(true);
      })
      .catch(() => {});
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

  // TODO: This action needs to added to the onpress event for continue button and has to handled in INTLSAOPS-7829
  const handleContinueAction = () => {
    const itemOHQty = itemDetails?.onHandsQty;
    if (itemOHQty === totalOHQty) {
      dispatch(
        noAction({
          upc: itemDetails?.upcNbr || '',
          itemNbr: itemNumber,
          scannedValue: itemNumber.toString()
        })
      );
    } else {
      // TODO: This logic has to be handled in INTLSAOPS-7839
      setShowOnHandsConfirmationModal(true);
    }
  };

  if (completeItemApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={completeItemApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

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
      {renderDeleteLocationModal(
        deleteFloorLocationApi,
        showDeleteConfirmationModal,
        setShowDeleteConfirmationModal,
        deleteLocationConfirmed,
        locToConfirm.locationName
      )}
      {renderConfirmOnHandsModal(
        updateOHQtyApi,
        showOnHandsConfirmationModal,
        setShowOnHandsConfirmationModal,
        totalOHQty,
        itemDetails,
        dispatch
      )}
      {isManualScanEnabled && (
        <ManualScanComponent placeholder={strings('LOCATION.PALLET')} />
      )}
      <View style={styles.itemCardContainer}>
        <ItemCard
          itemNumber={itemDetails ? itemDetails.itemNbr : 0}
          description={itemDetails ? itemDetails.itemName : ''}
          imageUrl={undefined}
          onHandQty={itemDetails ? itemDetails.onHandsQty : 0}
          onClick={() => {}}
          loading={getItemDetailsApi.isWaiting}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getFloorLocationList(floorLocations)}
              locationType="floor"
              add={() => addLocationHandler(itemDetails, dispatch, navigation)}
              loading={getItemDetailsApi.isWaiting || getLocationApi.isWaiting}
              error={!!(getItemDetailsApi.error || getLocationApi.error)}
              onRetry={() => {}}
              scanRequired={userConfig.scanRequired}
            />
          </View>
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getReserveLocationList(reserveLocations)}
              locationType="reserve"
              loading={getItemPalletsApi.isWaiting}
              error={!!getItemPalletsApi.error}
              scanRequired={userConfig.scanRequired}
              onRetry={handleReserveLocsRetry}
            />
          </View>
          <View>
            <OtherOHItemCard
              flyCloudInTransitOH={itemDetails?.inTransitCloudQty || 0}
              flyCloudOH={itemDetails?.cloudQty || 0}
              claimsOH={itemDetails?.claimsOnHandQty || 0}
              consolidatorOH={itemDetails?.consolidatedOnHandQty || 0}
              loading={getItemDetailsApi.isWaiting}
              collapsed={false}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <AuditScreenFooter
          totalCount={calculateTotalOHQty(
            floorLocations,
            reserveLocations,
            itemDetails
          )}
          onContinueClick={handleContinueAction}
          disabledContinue={disabledContinue(
            floorLocations,
            reserveLocations,
            userConfig.scanRequired
          )}
        />
      </View>
    </>
  );
};

const AuditItem = (): JSX.Element => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(
    state => state.Global
  );
  const getItemDetailsApi = useTypedSelector(
    state => state.async.getItemDetails
  );
  const getLocationApi = useTypedSelector(state => state.async.getLocation);
  const userConfig = useTypedSelector(state => state.User.configs);
  const deleteFloorLocationApi = useTypedSelector(
    state => state.async.deleteLocation
  );
  const getItemPalletsApi = useTypedSelector(
    state => state.async.getItemPallets
  );
  const updateOHQtyApi = useTypedSelector(state => state.async.updateOHQty);
  const { userId } = useTypedSelector(state => state.User);
  const userFeatures = useTypedSelector(state => state.User.features);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const itemNumber = useTypedSelector(state => state.AuditWorklist.itemNumber);
  const [showItemNotFoundMsg, setShowItemNotFoundMsg] = useState(false);
  const { itemDetails, floorLocations, reserveLocations, scannedPalletId } =
    useTypedSelector(state => state.AuditItemScreen);
  const [showPalletQtyUpdateModal, setShowPalletQtyUpdateModal] =
    useState(false);
  const completeItemApi = useTypedSelector(state => state.async.noAction);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const showOnHandsConfirmState = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '',
    locationArea: '',
    locationIndex: -1,
    locationTypeNbr: -1
  });

  return (
    <AuditItemScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      getItemDetailsApi={getItemDetailsApi}
      getItemPalletsApi={getItemPalletsApi}
      deleteFloorLocationApi={deleteFloorLocationApi}
      getLocationApi={getLocationApi}
      updateOHQtyApi={updateOHQtyApi}
      completeItemApi={completeItemApi}
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
      showDeleteConfirmationModal={showDeleteConfirmationModal}
      setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
      locToConfirm={locToConfirm}
      setLocToConfirm={setLocToConfirm}
      showOnHandsConfirmState={showOnHandsConfirmState}
    />
  );
};

export default AuditItem;
