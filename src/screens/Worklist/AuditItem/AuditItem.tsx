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
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import { AxiosError, AxiosHeaders } from 'axios';
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
  CLEAR_PALLET,
  DELETE_LOCATION,
  GET_ITEM_DETAILS,
  GET_ITEM_PALLETS,
  NO_ACTION,
  UPDATE_MULTI_PALLET_UPC_QTY,
  UPDATE_OH_QTY
} from '../../../state/actions/asyncAPI';
import {
  clearPallet,
  deleteLocation,
  getItemDetails,
  getItemPallets,
  getItemPalletsV1,
  getLocationDetails,
  noAction,
  updateMultiPalletUPCQty,
  updateOHQty
} from '../../../state/actions/saga';

import ItemCard from '../../../components/ItemCard/ItemCard';
import LocationListCard, {
  LocationList
} from '../../../components/LocationListCard/LocationListCard';
import OtherOHItemCard from '../../../components/OtherOHItemCard/OtherOHItemCard';
import {
  setFloorLocations as setItemFloorLocations,
  setReserveLocations as setItemReserveLocations,
  setupScreen
} from '../../../state/actions/ItemDetailScreen';
import { AsyncState } from '../../../models/AsyncState';
import {
  clearAuditScreenData,
  setFloorLocations,
  setItemDetails,
  setReserveLocations,
  setScannedPalletId,
  updateFloorLocationQty,
  updatePalletQty,
  updatePalletScannedStatus
} from '../../../state/actions/AuditItemScreen';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import PalletQtyUpdate from '../../../components/PalletQtyUpdate/PalletQtyUpdate';
import Button from '../../../components/buttons/Button';
import { UseStateType } from '../../../models/Generics.d';
import { approvalRequestSource } from '../../../models/ApprovalListItem';
import CalculatorModal from '../../../components/CustomCalculatorModal/CalculatorModal';
import { UpdateMultiPalletUPCQtyRequest } from '../../../services/PalletManagement.service';
import { GetItemPalletsResponse, Pallet } from '../../../models/ItemPallets';

export interface AuditItemScreenProps {
  scannedEvent: { value: string | null; type: string | null };
  isManualScanEnabled: boolean;
  getItemDetailsApi: AsyncState;
  getLocationApi: AsyncState;
  getItemPalletsApi: AsyncState;
  deleteFloorLocationApi: AsyncState;
  updateOHQtyApi: AsyncState;
  completeItemApi: AsyncState;
  // eslint-disable-next-line react/no-unused-prop-types
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
  itemNumber: number;
  showItemNotFoundMsg: boolean;
  setShowItemNotFoundMsg: React.Dispatch<React.SetStateAction<boolean>>;
  itemDetails: ItemDetails | null;
  showPalletQtyUpdateModal: boolean;
  setShowPalletQtyUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  scannedPalletId: number;
  userConfig: Configurations;
  showDeleteConfirmationModal: boolean;
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  locToConfirm: {
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
    palletId: number;
    sectionId: number;
  };
  setLocToConfirm: React.Dispatch<React.SetStateAction<{
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
    palletId: number;
    sectionId: number;
  }>>;
  deletePalletApi: AsyncState;
  showOnHandsConfirmState: UseStateType<boolean>;
  getItemPalletsError: boolean;
  setGetItemPalletsError: React.Dispatch<React.SetStateAction<boolean>>;
  showCalcModalState: UseStateType<boolean>;
  locationListState: UseStateType<Pick<LocationList, 'locationName' | 'locationType' | 'palletId'>>;
  countryCode: string;
  updateMultiPalletUPCQtyApi: AsyncState;
  getItemPalletsDispatch: typeof getItemPallets | typeof getItemPalletsV1
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
    itemNumber,
    getItemPalletsDispatch
  } = props;

  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name)
      .then(() => {
        if (itemNumber > 0) {
          dispatch({ type: GET_ITEM_DETAILS.RESET });
          dispatch(getItemDetails({ id: itemNumber }));
          dispatch(getItemPalletsDispatch({ itemNbr: itemNumber }));
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
  navigation: NavigationProp<any>,
  floorLocations: Location[],
  trackEventCall: (eventName: string, params?: any) => void,
) => {
  const reserveLoc = itemDetails?.location?.reserve;
  dispatch(
    setupScreen(
      itemDetails ? itemDetails.itemNbr : 0,
      itemDetails ? itemDetails.upcNbr : '',
      itemDetails?.exceptionType,
      -999,
      false,
      false
    )
  );

  if (floorLocations.length > 0) {
    dispatch(setItemFloorLocations(floorLocations));
  }
  if (reserveLoc) {
    dispatch(setItemReserveLocations(reserveLoc));
  }

  trackEventCall('Audit_Item', { action: 'add_new_floor_location_click', itemNumber: itemDetails?.itemNbr });
  navigation.navigate('AddLocation');
};

export const calculateFloorLocDecreaseQty = (
  newOHQty: number,
  locationName: string,
  dispatch: Dispatch<any>
) => {
  const OH_MIN = 1;
  const OH_MAX = 9999;
  if (newOHQty > OH_MAX) {
    dispatch(updateFloorLocationQty(locationName, OH_MAX));
  } else if (newOHQty > OH_MIN) {
    dispatch(updateFloorLocationQty(locationName, newOHQty - 1));
  }
};

export const calculateFloorLocIncreaseQty = (
  newOHQty: number,
  locationName: string,
  dispatch: Dispatch<any>
) => {
  const OH_MIN = 1;
  const OH_MAX = 9999;
  if (newOHQty < OH_MIN || Number.isNaN(newOHQty)) {
    dispatch(updateFloorLocationQty(locationName, OH_MIN));
  } else if (newOHQty < OH_MAX) {
    dispatch(updateFloorLocationQty(locationName, (newOHQty || 0) + 1));
  }
};

export const calculatePalletDecreaseQty = (
  newOHQty: number,
  palletId: number,
  dispatch: Dispatch<any>
) => {
  const OH_MIN = 0;
  const OH_MAX = 9999;
  if (newOHQty > OH_MAX) {
    dispatch(updatePalletQty(palletId, OH_MAX));
  } else if (newOHQty > OH_MIN) {
    dispatch(updatePalletQty(palletId, newOHQty - 1));
  }
};

export const calculatePalletIncreaseQty = (
  newOHQty: number,
  palletId: number,
  dispatch: Dispatch<any>
) => {
  const OH_MIN = 0;
  const OH_MAX = 9999;
  if (newOHQty < OH_MIN || Number.isNaN(newOHQty)) {
    dispatch(updatePalletQty(palletId, OH_MIN));
  } else if (newOHQty < OH_MAX) {
    dispatch(updatePalletQty(palletId, (newOHQty || 0) + 1));
  }
};

export const getFloorLocationsResult = (
  floorResultsData: Location[] | undefined,
  dispatch: Dispatch<any>,
  existingFloorLocations: Location[]
) => {
  let updatedFloorLocations: Location[] = [];
  if (floorResultsData && floorResultsData.length > 0) {
    if (existingFloorLocations.length > 0) {
      updatedFloorLocations = floorResultsData.map((loc: Location) => {
        const alreadyExistedLocation = existingFloorLocations.find(
          existingLoc => existingLoc.locationName === `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        );
        return alreadyExistedLocation?.newQty
          ? { ...loc, newQty: alreadyExistedLocation.newQty } : { ...loc, newQty: loc.qty || 0 };
      });
    } else {
      updatedFloorLocations = floorResultsData.map((loc: Location) => ({ ...loc, newQty: loc.qty || 0 }));
    }
  }
  dispatch(setFloorLocations(updatedFloorLocations));
};

export const getUpdatedReserveLocations = (
  itemPallets: Pallet[] | undefined,
  existingReserveLocations: ItemPalletInfo[]
) => {
  let updatedReserveLocations = [];
  if (itemPallets && itemPallets.length > 0) {
    if (existingReserveLocations.length > 0) {
      updatedReserveLocations = itemPallets.map((loc: Pallet) => {
        const alreadyExistedLocation = existingReserveLocations.find(
          existingLoc => existingLoc.palletId === loc.palletId
        );
        return alreadyExistedLocation?.newQty
          ? { ...loc, newQty: alreadyExistedLocation.newQty } : { ...loc, newQty: loc.quantity || 0 };
      });
    } else {
      updatedReserveLocations = itemPallets.map((loc: Pallet) => ({ ...loc, newQty: loc.quantity || 0 }));
    }
    return updatedReserveLocations;
  }
  return [];
};

export const getLocationsApiHook = (
  getLocationApi: AsyncState,
  itemNumber: number,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  existingFloorLocations: Location[]
) => {
  if (navigation.isFocused()) {
    if (!getLocationApi.isWaiting && getLocationApi.result && getLocationApi.value?.itemNbr === itemNumber) {
      const locDetails = getLocationApi.result.data;
      if (locDetails && locDetails.location) {
        getFloorLocationsResult(locDetails.location.floor, dispatch, existingFloorLocations);
      }
    }
  }
};

export const getItemDetailsApiHook = (
  getItemDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowItemNotFoundMsg: React.Dispatch<React.SetStateAction<boolean>>,
  existingFloorLocations: Location[]
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.result) {
      if (
        getItemDetailsApi.result.status === 200
        || getItemDetailsApi.result.status === 207
      ) {
        const itemDetails: ItemDetails = getItemDetailsApi.result.data;
        dispatch(setItemDetails(itemDetails));
        getFloorLocationsResult(
          itemDetails?.location?.floor,
          dispatch,
          existingFloorLocations
        );
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
      !deleteFloorLocationApi.isWaiting
      && deleteFloorLocationApi.error
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

export const deletePalletApiHook = (
  deletePalletApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  palletId: number,
  itemNbr: number,
  getItemPalletsDispatch: typeof getItemPallets | typeof getItemPalletsV1
) => {
  if (navigation.isFocused()) {
    if (!deletePalletApi.isWaiting && deletePalletApi.result) {
      setShowDeleteConfirmationModal(false);
      if (deletePalletApi.result.status === 200) {
        Toast.show({
          type: 'success',
          text1: strings('WORKLIST.MISSING_PALLET_API_SUCCESS', { palletId }),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
        dispatch(getItemPalletsDispatch({ itemNbr }));
        dispatch({ type: CLEAR_PALLET.RESET });
      }
    } else if (!deletePalletApi.isWaiting && deletePalletApi.error) {
      setShowDeleteConfirmationModal(false);
      Toast.show({
        type: 'error',
        text1: strings('WORKLIST.MISSING_PALLET_API_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      dispatch({ type: CLEAR_PALLET.RESET });
    }
  }
};

export const getItemPalletsApiHook = (
  getItemPalletsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  existingReserveLocations: ItemPalletInfo[],
  setGetItemPalletsError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemPalletsApi.isWaiting && getItemPalletsApi.result) {
      if (getItemPalletsApi.result.status === 200) {
        const { data }: {data: GetItemPalletsResponse} = getItemPalletsApi.result;
        const updatedReserveLocations = getUpdatedReserveLocations(data.pallets, existingReserveLocations);
        dispatch(setReserveLocations(updatedReserveLocations));
      }
      // item does not have any location
      if (getItemPalletsApi.result.status === 204) {
        dispatch(setReserveLocations([]));
      }
      dispatch({ type: GET_ITEM_PALLETS.RESET });
      setGetItemPalletsError(false);
    }
    // No pallets associated with the item
    if (!getItemPalletsApi.isWaiting && getItemPalletsApi.error) {
      if (getItemPalletsApi.error.response && getItemPalletsApi.error.response.status === 409
        && getItemPalletsApi.error.response.data.errorEnum === 'NO_PALLETS_FOUND_FOR_ITEM') {
        dispatch(setReserveLocations([]));
        setGetItemPalletsError(false);
      } else {
        setGetItemPalletsError(true);
      }
      dispatch({ type: GET_ITEM_PALLETS.RESET });
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
    const scannedPallet = parseInt(scannedEvent.value, 10);
    const matchedPallet = reserveLocations.find(
      loc => loc.palletId === scannedPallet
    );
    if (matchedPallet) {
      setShowPalletQtyUpdateModal(true);
      dispatch(setScannedPalletId(scannedPallet));
      dispatch(updatePalletScannedStatus(scannedPallet, true));
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
  scannedPalletId: number,
  reserveLocations: ItemPalletInfo[],
  dispatch: Dispatch<any>,
  showPalletQtyUpdateModal: boolean,
  setShowPalletQtyUpdateModal: React.Dispatch<React.SetStateAction<boolean>>,
  showCalculator: boolean,
  vendorPackQty?: number,
) => {
  const palletInfo = reserveLocations.find(
    pallet => pallet.palletId === scannedPalletId
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
        palletId={scannedPalletId}
        qty={newPalletQty || qty || 0}
        handleClose={() => {
          setShowPalletQtyUpdateModal(false);
        }}
        handleSubmit={(newQty: number) => {
          dispatch(updatePalletQty(scannedPalletId, newQty));
          setShowPalletQtyUpdateModal(false);
        }}
        showCalculator={showCalculator}
      />
    </CustomModalComponent>
  );
};

export const getMultiPalletList = (reserveLocations: ItemPalletInfo[]) => {
  const newPalletList: UpdateMultiPalletUPCQtyRequest['PalletList'] = reserveLocations.map(item => (
    {
      palletId: item.palletId,
      expirationDate: '', // This is fine as it does not update the expiration date on the pallet
      upcs: [{ upcNbr: item.upcNbr || '0', quantity: item.newQty }]
    }
  ));

  return newPalletList;
};

export const completeItemApiHook = (
  completeItemApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  reserveLocations: ItemPalletInfo[],
  itemDetails: ItemDetails | null,
  hasNewQty: boolean
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
      // Calls update Multi Pallet Qty Endpoint if Pallet Quantities were changed but Total On Hands is the same
      if (hasNewQty) {
        dispatch(updateMultiPalletUPCQty({ PalletList: getMultiPalletList(reserveLocations) }));
      } else {
        navigation.goBack();
      }
    }
  }
};

export const updateOHQtyApiHook = (
  updateOHQtyApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  reserveLocations: ItemPalletInfo[],
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

      dispatch(updateMultiPalletUPCQty({ PalletList: getMultiPalletList(reserveLocations) }));
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

export const updateMultiPalletUPCQtyApiHook = (
  updateMultiPalletUPCQtyApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowOnHandsConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  itemNbr: number
) => {
  if (navigation.isFocused()) {
    if (!updateMultiPalletUPCQtyApi.isWaiting && updateMultiPalletUPCQtyApi.result) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });

      dispatch({ type: UPDATE_MULTI_PALLET_UPC_QTY.RESET });
      setShowOnHandsConfirmationModal(false);
      dispatch(setScannedEvent({ type: 'worklist', value: itemNbr.toString() }));
      navigation.goBack();
    }
    if (!updateMultiPalletUPCQtyApi.isWaiting && updateMultiPalletUPCQtyApi.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
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
  const otherOHTotalCount = (itemDetails?.claimsOnHandQty || 0)
    + (itemDetails?.inTransitCloudQty || 0)
    + (itemDetails?.cloudQty || 0)
    + (itemDetails?.consolidatedOnHandQty || 0);
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
  deletePalletApi: AsyncState,
  showDeleteConfirmationModal: boolean,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  deleteLocationConfirmed: (locType: string) => void,
  locationName: string,
  locationType: string,
  palletId: number,
  trackEventCall: (eventName: string, params?: any) => void
) => (
  <CustomModalComponent
    isVisible={showDeleteConfirmationModal}
    onClose={() => setShowDeleteConfirmationModal(false)}
    modalType="Error"
    minHeight={100}
  >
    {deleteFloorLocationApi.isWaiting || deletePalletApi.isWaiting ? (
      <ActivityIndicator
        animating={deleteFloorLocationApi.isWaiting || deletePalletApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    ) : (
      <>
        <Text style={styles.message}>
          {locationType === 'floor' && (deleteFloorLocationApi.error
            ? strings('LOCATION.DELETE_LOCATION_API_ERROR')
            : `${strings('LOCATION.DELETE_CONFIRMATION')}${locationName
            }`)}
          {locationType === 'reserve' && (deletePalletApi.error
            ? strings('ITEM.DELETE_PALLET_FAILURE')
            : `${strings('MISSING_PALLET_WORKLIST.DELETE_PALLET_CONFIRMATION', { palletId })}`)}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title={strings('GENERICS.CANCEL')}
            backgroundColor={COLOR.MAIN_THEME_COLOR}
            testID="modal-cancel-button"
            onPress={() => {
              setShowDeleteConfirmationModal(false);
              trackEventCall('Audit_Item', { action: 'cancel_delete_location_click', locationType });
            }}
          />
          <Button
            style={styles.button}
            title={deleteFloorLocationApi.error || deletePalletApi.error
              ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
            testID="modal-confirm-button"
            backgroundColor={COLOR.TRACKER_RED}
            onPress={() => {
              deleteLocationConfirmed(locationType);
              if (locationType === 'reserve') {
                trackEventCall(
                  'Audit_Item',
                  { action: 'delete_pallet_confirmation_click', palletId }
                );
              } else {
                trackEventCall(
                  'Audit_Item',
                  { action: 'confirm_delete_location_click', locName: locationName }
                );
              }
            }}
          />
        </View>
      </>
    )}
  </CustomModalComponent>
);

export const renderConfirmOnHandsModal = (
  updateOHQtyApi: AsyncState,
  updateMultiPalletUPCQtyApi: AsyncState,
  showOnHandsConfirmationModal: boolean,
  setShowOnHandsConfirmationModal: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  updatedQuantity: number,
  itemDetails: ItemDetails | null,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  worklistType: string
) => {
  const onHandsQty = itemDetails?.onHandsQty || 0;
  const basePrice = itemDetails?.basePrice || 0;
  const changeQuantity = updatedQuantity - onHandsQty;
  const priceChange = basePrice * changeQuantity;
  const priceLimit = Math.abs(priceChange) > 1000.0;
  return (
    <CustomModalComponent
      isVisible={showOnHandsConfirmationModal}
      onClose={() => setShowOnHandsConfirmationModal(false)}
      modalType="Popup"
      minHeight={150}
    >
      {updateOHQtyApi.isWaiting || updateMultiPalletUPCQtyApi.isWaiting ? (
        <ActivityIndicator
          animating={updateOHQtyApi.isWaiting || updateMultiPalletUPCQtyApi.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
          {priceLimit && (
            <MaterialCommunityIcon
              name="alert"
              size={40}
              color={COLOR.ORANGE}
            />
          )}
          <Text style={styles.confirmText}>
            {strings('AUDITS.CONFIRM_AUDIT')}
          </Text>
          {priceLimit && (
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
              onPress={() => {
                trackEventCall(
                  'Audit_Item',
                  { action: 'cancel_OH_qty_update', itemNumber: itemDetails?.itemNbr, upcNbr: itemDetails?.upcNbr }
                );
                setShowOnHandsConfirmationModal(false);
              }}
              type={2}
            />
            <Button
              style={styles.button}
              title={strings('GENERICS.SUBMIT')}
              testID="modal-confirm-button"
              backgroundColor={COLOR.MAIN_THEME_COLOR}
              onPress={() => {
                trackEventCall(
                  'Audit_Item',
                  {
                    action: 'complete_audit_item_click',
                    type: 'OH_qty_update',
                    itemNumber: itemDetails?.itemNbr,
                    upcNbr: itemDetails?.upcNbr
                  }
                );
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
                    },
                    worklistType
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

export const renderCalculatorModal = (
  locationListItem: Pick<LocationList, 'locationName' | 'locationType' | 'palletId'>,
  showCalcModal: boolean,
  setShowCalcModal: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>
) => {
  const { locationName, locationType, palletId } = locationListItem;
  return (
    <CalculatorModal
      visible={showCalcModal}
      disableAcceptButton={(value: string): boolean => {
        const calcValue = parseFloat(value);
        return !(typeof (calcValue) === 'number' && calcValue % 1 === 0 && calcValue >= 0);
      }}
      showAcceptButton={true}
      onClose={() => setShowCalcModal(false)}
      onAccept={(value: string) => {
        const calcValue = Number(value);
        if (locationName !== '') {
          if (locationType === 'floor') {
            dispatch(updateFloorLocationQty(locationName, calcValue));
          } else {
            dispatch(updatePalletQty(palletId, calcValue));
          }
          setShowCalcModal(false);
        }
      }}
    />
  );
};
export const disabledContinue = (
  floorLocations: Location[],
  reserveLocations: ItemPalletInfo[],
  scanRequired: boolean,
  itemDetailsLoading: boolean
): boolean => itemDetailsLoading || floorLocations.some(loc => (loc.newQty || loc.qty || 0) < 0)
  || reserveLocations.some(
    loc => (scanRequired && !loc.scanned) || (loc.newQty || loc.quantity || -1) < 0
  );

export const sortReserveLocations = (locations: ItemPalletInfo[]) => {
  const sortLocationNames = (a: ItemPalletInfo, b: ItemPalletInfo) => {
    if (a.locationName > b.locationName) return 1;
    if (a.locationName < b.locationName) return -1;

    if (a.palletId > b.palletId) return 1;
    if (a.palletId < b.palletId) return -1;

    return 0;
  };

  return locations.sort(sortLocationNames);
};

export const AuditItemScreen = (props: AuditItemScreenProps): JSX.Element => {
  const {
    scannedEvent,
    isManualScanEnabled,
    getLocationApi,
    getItemDetailsApi,
    deleteFloorLocationApi,
    updateOHQtyApi,
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
    deletePalletApi,
    showOnHandsConfirmState,
    setGetItemPalletsError,
    getItemPalletsError,
    showCalcModalState,
    locationListState,
    countryCode,
    updateMultiPalletUPCQtyApi,
    getItemPalletsDispatch
  } = props;
  let scannedSubscription: EmitterSubscription;

  const [showOnHandsConfirmationModal, setShowOnHandsConfirmationModal] = showOnHandsConfirmState;
  const [showCalcModal, setShowCalcModal] = showCalcModalState;
  const [location, setLocation] = locationListState;

  const totalOHQty = calculateTotalOHQty(
    floorLocations,
    reserveLocations,
    itemDetails
  );

  const hasNewQty = reserveLocations.some(loc => loc.quantity !== loc.newQty);
  const MIN = 0;
  const MAX = 9999;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused() && userConfig.scanRequired) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall('Audit_Item', {
            action: 'section_details_scan',
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
    () => getScannedPalletEffect(
      navigation,
      scannedEvent,
      reserveLocations,
      dispatch,
      setShowPalletQtyUpdateModal
    ),
    [scannedEvent]
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
    () => getLocationsApiHook(getLocationApi, itemNumber, dispatch, navigation, floorLocations),
    [getLocationApi]
  );

  // Get Item Details UPC api
  useEffectHook(
    () => getItemDetailsApiHook(getItemDetailsApi, dispatch, navigation, setShowItemNotFoundMsg, floorLocations),
    [getItemDetailsApi]
  );

  // Get Pallets api
  useEffectHook(
    () => getItemPalletsApiHook(getItemPalletsApi, dispatch, navigation, reserveLocations, setGetItemPalletsError),
    [getItemPalletsApi]
  );

  // Complete Item API
  useEffectHook(
    () => completeItemApiHook(completeItemApi, dispatch, navigation, reserveLocations, itemDetails, hasNewQty),
    [completeItemApi, hasNewQty]
  );

  // Delete Location API
  useEffectHook(
    () => deleteFloorLocationApiHook(
      deleteFloorLocationApi,
      itemNumber,
      dispatch,
      navigation,
      setShowDeleteConfirmationModal,
      locToConfirm.locationName
    ),
    [deleteFloorLocationApi]
  );

  // report missing pallet API
  useEffectHook(
    () => deletePalletApiHook(
      deletePalletApi,
      dispatch,
      navigation,
      setShowDeleteConfirmationModal,
      locToConfirm.palletId,
      itemNumber,
      getItemPalletsDispatch
    ),
    [deletePalletApi]
  );

  // Navigation Listener
  useEffectHook(() => {
    // Clear Audit Item Screen redux state before removing the component
    navigation.addListener('beforeRemove', () => {
      dispatch(clearAuditScreenData());
    });
  }, []);

  // Update OH quantity API
  useEffectHook(() => updateOHQtyApiHook(
    updateOHQtyApi,
    dispatch,
    navigation,
    reserveLocations
  ), [updateOHQtyApi]);

  // Update Multiple Pallet's UPC Qty API
  useEffectHook(() => updateMultiPalletUPCQtyApiHook(
    updateMultiPalletUPCQtyApi,
    dispatch,
    navigation,
    setShowOnHandsConfirmationModal,
    itemDetails?.itemNbr || 0
  ), [updateMultiPalletUPCQtyApi]);

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

  if (
    !getItemDetailsApi.isWaiting
    && (getItemDetailsApi.error || (itemDetails && itemDetails.message))
  ) {
    const message = itemDetails && itemDetails.message ? itemDetails.message : undefined;
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

  const deleteLocationConfirmed = (locType: string) => {
    if (locType === 'reserve') {
      dispatch(
        clearPallet({
          palletId: locToConfirm.palletId ? locToConfirm.palletId.toString() : '0'
        }),
      );
    } else {
      dispatch(
        deleteLocation({
          headers: new AxiosHeaders({ itemNumber }),
          upc: itemDetails?.upcNbr || '',
          sectionId: locToConfirm.locationName,
          locationTypeNbr: locToConfirm.locationTypeNbr
        }),
      );
    }
  };

  const handleReserveLocsRetry = () => {
    validateSession(navigation, route.name).then(() => {
      dispatch({ type: GET_ITEM_PALLETS.RESET });
      dispatch(getItemPalletsDispatch({ itemNbr: itemNumber }));
    }).catch(() => { });
  };

  const handleDeleteLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall(
        'Audit_Item',
        { action: 'delete_floor_location_click', location: JSON.stringify(loc), index: locIndex }
      );
      setLocToConfirm({
        locationName: loc.locationName,
        locationArea: 'floor',
        locationIndex: locIndex,
        locationTypeNbr: loc.typeNbr,
        palletId: 0,
        sectionId: 0
      });
      setShowDeleteConfirmationModal(true);
    }).catch(() => { });
  };

  const handleDeleteReserveLocation = (loc: ItemPalletInfo, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall(
        'Audit_Item',
        { action: 'delete_pallet_click', location: JSON.stringify(loc), index: locIndex }
      );
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
      const sortLocations = (a: Location, b: Location) => (
        a.zoneName.localeCompare(b.zoneName)
                  || a.aisleName.localeCompare(b.aisleName)
                  || a.sectionName.localeCompare(b.sectionName)
      );

      locations.sort(sortLocations);
      locations.forEach((loc: Location, index: number) => {
        locationLst.push({
          sectionId: loc.sectionId,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`,
          quantity: loc.newQty,
          oldQuantity: 0,
          locationType: 'floor',
          palletId: 0,
          increment: () => calculateFloorLocIncreaseQty(loc.newQty, loc.locationName, dispatch),
          decrement: () => calculateFloorLocDecreaseQty(loc.newQty, loc.locationName, dispatch),
          onDelete: () => handleDeleteLocation(loc, index),
          qtyChange: (qty: string) => {
            dispatch(updateFloorLocationQty(loc.locationName, parseInt(qty, 10)));
          },
          onEndEditing: () => {
            if (typeof (loc.newQty) !== 'number' || Number.isNaN(loc.newQty)) {
              dispatch(updateFloorLocationQty(loc.locationName, 0));
            }
          },
          onCalcPress: () => {
            setLocation({ locationName: loc.locationName, locationType: 'floor', palletId: 0 });
            setShowCalcModal(true);
          }
        });
      });
    }
    return locationLst;
  };

  const getReserveLocationList = (locations: ItemPalletInfo[]) => {
    const locationLst: LocationList[] = [];
    if (locations && locations.length) {
      const sortedLocations = sortReserveLocations(locations);
      sortedLocations.forEach((loc, index) => {
        locationLst.push({
          sectionId: loc.sectionId,
          locationName: loc.locationName,
          quantity: loc.newQty,
          oldQuantity: loc.quantity,
          scanned: loc.scanned,
          palletId: loc.palletId,
          locationType: 'reserve',
          increment: () => calculatePalletIncreaseQty(loc.newQty, loc.palletId, dispatch),
          decrement: () => calculatePalletDecreaseQty(loc.newQty, loc.palletId, dispatch),
          onDelete: () => handleDeleteReserveLocation(loc, index),
          qtyChange: (qty: string) => {
            dispatch(updatePalletQty(loc.palletId, parseInt(qty, 10)));
          },
          onEndEditing: () => {
            if (typeof (loc.newQty) !== 'number' || Number.isNaN(loc.newQty)) {
              dispatch(updatePalletQty(loc.palletId, 0));
            }
          },
          onCalcPress: () => {
            setLocation({ locationName: loc.locationName, locationType: 'reserve', palletId: loc.palletId });
            setShowCalcModal(true);
          }
        });
      });
    }
    return locationLst;
  };

  const handleContinueAction = () => {
    const itemOHQty = itemDetails?.onHandsQty;
    trackEventCall('Audit_Item', { action: 'continue_action_click', itemNumber });
    if (itemOHQty === totalOHQty) {
      dispatch(
        noAction({
          upc: itemDetails?.upcNbr || '',
          itemNbr: itemNumber,
          scannedValue: itemNumber.toString(),
          headers: new AxiosHeaders({ worklistType: route.params?.worklistType ?? 'AU' })
        })
      );
    } else {
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
        userConfig.showCalculator,
        itemDetails?.vendorPackQty
      )}
      {renderDeleteLocationModal(
        deleteFloorLocationApi,
        deletePalletApi,
        showDeleteConfirmationModal,
        setShowDeleteConfirmationModal,
        deleteLocationConfirmed,
        locToConfirm.locationName,
        locToConfirm.locationArea,
        locToConfirm.palletId,
        trackEventCall
      )}
      {renderConfirmOnHandsModal(
        updateOHQtyApi,
        updateMultiPalletUPCQtyApi,
        showOnHandsConfirmationModal,
        setShowOnHandsConfirmationModal,
        totalOHQty,
        itemDetails,
        dispatch,
        trackEventCall,
        route.params?.worklistType ?? 'AU'
      )}
      {(renderCalculatorModal(location, showCalcModal, setShowCalcModal, dispatch))}
      {isManualScanEnabled && (
        <ManualScanComponent placeholder={strings('LOCATION.PALLET')} />
      )}
      <View style={styles.itemCardContainer}>
        <ItemCard
          itemNumber={itemDetails ? itemDetails.itemNbr : 0}
          description={itemDetails ? itemDetails.itemName : ''}
          onHandQty={itemDetails ? itemDetails.onHandsQty : 0}
          onClick={() => {
            trackEventCall('Audit_Item', { action: 'item_card_click', itemNumber: itemDetails?.itemNbr });
          }}
          loading={getItemDetailsApi.isWaiting}
          countryCode={countryCode}
          showItemImage={userConfig.showItemImage}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        nestedScrollEnabled={true}
      >
        <View style={styles.container}>
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getFloorLocationList(floorLocations)}
              locationType="floor"
              add={() => addLocationHandler(itemDetails, dispatch, navigation, floorLocations, trackEventCall)}
              loading={getItemDetailsApi.isWaiting || getLocationApi.isWaiting}
              error={!!(getItemDetailsApi.error || getLocationApi.error)}
              onRetry={() => {}}
              scanRequired={userConfig.scanRequired}
              showCalculator={userConfig.showCalculator}
              minQty={MIN}
              maxQty={MAX}
            />
          </View>
          <View style={styles.marginBottomStyle}>
            <LocationListCard
              locationList={getReserveLocationList(reserveLocations)}
              locationType="reserve"
              loading={getItemPalletsApi.isWaiting}
              error={getItemPalletsError}
              scanRequired={userConfig.scanRequired}
              onRetry={handleReserveLocsRetry}
              showCalculator={userConfig.showCalculator}
              minQty={MIN}
              maxQty={MAX}
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
              countryCode={countryCode}
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
            userConfig.scanRequired,
            getItemDetailsApi.isWaiting
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
  const { userId, features: userFeatures, configs: userConfig } = useTypedSelector(state => state.User);
  const getLocationApi = useTypedSelector(state => state.async.getLocation);
  const deleteFloorLocationApi = useTypedSelector(state => state.async.deleteLocation);
  const deletePalletApi = useTypedSelector(state => state.async.clearPallet);
  const getItemPalletsApi = userConfig.peteGetPallets ? useTypedSelector(state => state.async.getItemPalletsV1)
    : useTypedSelector(state => state.async.getItemPallets);
  const updateOHQtyApi = useTypedSelector(state => state.async.updateOHQty);
  const updateMultiPalletUPCQtyApi = useTypedSelector(state => state.async.updateMultiPalletUPCQty);
  const itemNumber = useTypedSelector(state => state.AuditWorklist.itemNumber);
  const {
    itemDetails, floorLocations, reserveLocations, scannedPalletId
  } = useTypedSelector(state => state.AuditItemScreen);
  const completeItemApi = useTypedSelector(state => state.async.noAction);

  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const [showItemNotFoundMsg, setShowItemNotFoundMsg] = useState(false);
  const [getItemPalletsError, setGetItemPalletsError] = useState(false);
  const [showPalletQtyUpdateModal, setShowPalletQtyUpdateModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const showOnHandsConfirmState = useState(false);
  const showCalcModalState = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '',
    locationArea: '',
    locationIndex: -1,
    locationTypeNbr: -1,
    sectionId: 0,
    palletId: 0
  });

  const locationListState = useState({
    locationName: '',
    locationType: 'floor',
    palletId: '-1'
  });

  const countryCode = useTypedSelector(state => state.User.countryCode);
  const getItemPalletsDispatch = userConfig.peteGetPallets ? getItemPalletsV1 : getItemPallets;
  return (
    <AuditItemScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      getItemDetailsApi={getItemDetailsApi}
      getItemPalletsApi={getItemPalletsApi}
      getItemPalletsDispatch={getItemPalletsDispatch}
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
      userFeatures={userFeatures}
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
      deletePalletApi={deletePalletApi}
      showOnHandsConfirmState={showOnHandsConfirmState}
      getItemPalletsError={getItemPalletsError}
      setGetItemPalletsError={setGetItemPalletsError}
      showCalcModalState={showCalcModalState}
      // @ts-expect-error typechecking error with location type
      locationListState={locationListState}
      countryCode={countryCode}
      updateMultiPalletUPCQtyApi={updateMultiPalletUPCQtyApi}
    />
  );
};

export default AuditItem;
