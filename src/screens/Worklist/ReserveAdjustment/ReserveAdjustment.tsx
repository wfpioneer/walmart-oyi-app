import React, {
  DependencyList,
  EffectCallback,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
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
import { CustomModalComponent } from '../../Modal/Modal';
import COLOR from '../../../themes/Color';
import LocationListCard, { LocationList } from '../../../components/LocationListCard/LocationListCard';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import { trackEvent } from '../../../utils/AppCenterTool';
import { validateSession } from '../../../utils/sessionTimeout';
import { Configurations } from '../../../models/User';
import ItemDetails from '../../../models/ItemDetails';

import { AsyncState } from '../../../models/AsyncState';
import { ItemPalletInfo } from '../../../models/AuditItem';
import ItemCard from '../../../components/ItemCard/ItemCard';
import { strings } from '../../../locales';
import Button, { ButtonType } from '../../../components/buttons/Button';
import { getUpdatedReserveLocations, sortReserveLocations } from '../AuditItem/AuditItem';
import {
  DELETE_PALLET, DELETE_UPCS, GET_ITEM_PALLETS, UPDATE_MULTI_PALLET_UPC_QTY_V2
} from '../../../state/actions/asyncAPI';
import {
  deletePallet, deleteUpcs, getItemPallets, getItemPalletsV1, updateMultiPalletUPCQtyV2
} from '../../../state/actions/saga';
import {
  setReserveLocations, setScannedPalletId, updatePalletQty, updatePalletScannedStatus
} from '../../../state/actions/ReserveAdjustmentScreen';
import styles from './ReserveAdjustment.style';
import ManualScanComponent from '../../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../../utils/scannerUtils';
import { resetScannedEvent, setScannedEvent } from '../../../state/actions/Global';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import PalletQtyUpdate from '../../../components/PalletQtyUpdate/PalletQtyUpdate';
import { UseStateType } from '../../../models/Generics.d';
import CalculatorModal from '../../../components/CustomCalculatorModal/CalculatorModal';
import { UpdateMultiPalletUPCQtyRequest } from '../../../services/PalletManagement.service';
import { GetItemPalletsResponse } from '../../../models/ItemPallets';

export const SCREEN_NAME = 'Reserve_Adjustment_Screen';

export interface ReserveAdjustmentScreenProps {
    getItemPalletsApi: AsyncState;
    deleteUpcsApi: AsyncState;
    deletePalletApi: AsyncState;
    reserveLocations: ItemPalletInfo[];
    route: RouteProp<any, string>;
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    trackEventCall: (eventName: string, params?: any) => void;
    getItemPalletsDispatch: ({ itemNbr }: {itemNbr: number}) => void;
    validateSessionCall: (
      navigation: NavigationProp<any>,
      route?: string
    ) => Promise<void>;
    useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
    useFocusEffectHook: (effect: EffectCallback) => void;
    itemDetails: ItemDetails | null;
    userConfig: Configurations;
    countryCode: string;
    getItemPalletsError: boolean;
    setGetItemPalletsError: React.Dispatch<React.SetStateAction<boolean>>;
    useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
    userId: string;
    isManualScanEnabled: boolean;
    scannedEvent: { value: string | null; type: string | null };
    scannedPalletId: number;
    showPalletQtyModalState: UseStateType<boolean>;
    showDeleteConfirmationState: UseStateType<boolean>;
    locToConfirm: {
      locationName: string;
      locationArea: string;
      locationIndex: number;
      locationTypeNbr: number;
      palletId: number;
      sectionId: number;
      mixedPallet: boolean;
    };
    setLocToConfirm: React.Dispatch<React.SetStateAction<{
      locationName: string;
      locationArea: string;
      locationIndex: number;
      locationTypeNbr: number;
      palletId: number;
      sectionId: number;
      mixedPallet: boolean;
    }>>;
    updateMultiPalletUPCQtyV2Api: AsyncState;
    showCalcModalState: UseStateType<boolean>;
    locationListState: UseStateType<Pick<LocationList, 'locationName' | 'locationType' | 'palletId'>>;
    showOnHandsConfirmState: UseStateType<boolean>;
}

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

const getReserveLocationList = (
  locations: ItemPalletInfo[],
  dispatch: Dispatch<any>,
  handleDeleteReserveLocation: (loc: ItemPalletInfo, locIndex: number) => void,
  setLocation: React.Dispatch<React.SetStateAction<Pick<LocationList, 'locationName' | 'palletId' | 'locationType'>>>,
  setShowCalcModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const locationLst: LocationList[] = [];
  if (locations && locations.length) {
    const sortedLocations = sortReserveLocations(locations);
    sortedLocations.forEach((loc, locIndex) => {
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
        onDelete: () => handleDeleteReserveLocation(loc, locIndex),
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

export const getItemPalletsApiHook = (
  getItemPalletsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  existingReserveLocations: ItemPalletInfo[],
  setGetItemPalletsError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused() && !getItemPalletsApi.isWaiting) {
    // on api success
    if (getItemPalletsApi.result) {
      if (getItemPalletsApi.result.status === 200) {
        const { data }: {data: GetItemPalletsResponse} = getItemPalletsApi.result;
        const updatedReserveLocations = getUpdatedReserveLocations(data.pallets, existingReserveLocations);
        dispatch(setReserveLocations(updatedReserveLocations));
      } else if (getItemPalletsApi.result.status === 204) {
        // item does not have any location
        dispatch(setReserveLocations([]));
      }
      dispatch({ type: GET_ITEM_PALLETS.RESET });
      setGetItemPalletsError(false);
    }
    // No pallets associated with the item
    if (getItemPalletsApi.error) {
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

export const renderDeleteLocationModal = (
  deletePalletApi: AsyncState,
  deleteUpcsApi: AsyncState,
  showDeleteConfirmationModal: boolean,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  trackEventCall: (eventName: string, params?: any) => void,
  dispatch: Dispatch<any>,
  locToConfirm: {
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
    palletId: number;
    sectionId: number;
    mixedPallet: boolean;
  },
  upcNbr?: string
) => {
  const apiIsWaiting = deletePalletApi.isWaiting || deleteUpcsApi.isWaiting;
  const apiHasError = deletePalletApi.error || deleteUpcsApi.error;
  return (
    <CustomModalComponent
      isVisible={showDeleteConfirmationModal}
      onClose={() => setShowDeleteConfirmationModal(false)}
      modalType="Error"
      minHeight={100}
    >
      {apiIsWaiting ? (
        <ActivityIndicator
          animating={apiIsWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
          <Text style={styles.message}>
            {apiHasError
              ? strings('ITEM.DELETE_PALLET_FAILURE')
              : `${strings('MISSING_PALLET_WORKLIST.DELETE_PALLET_CONFIRMATION')}`}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              title={strings('GENERICS.CANCEL')}
              backgroundColor={COLOR.MAIN_THEME_COLOR}
              testID="modal-cancel-button"
              onPress={() => {
                setShowDeleteConfirmationModal(false);
                trackEventCall(SCREEN_NAME, { action: 'cancel_delete_location_click' });
              }}
            />
            <Button
              style={styles.button}
              title={apiHasError ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
              testID="modal-confirm-button"
              backgroundColor={COLOR.TRACKER_RED}
              onPress={() => {
                trackEventCall(
                  SCREEN_NAME,
                  { action: 'missing_pallet_confirmation_click', palletId: locToConfirm.palletId }
                );
                if (locToConfirm.mixedPallet && upcNbr) {
                  dispatch(deleteUpcs({
                    palletId: locToConfirm.palletId.toString(),
                    removeExpirationDate: false,
                    upcs: [upcNbr]
                  }));
                } else {
                  dispatch(deletePallet({ palletId: locToConfirm.palletId }));
                }
              }}
            />
          </View>
        </>
      )}
    </CustomModalComponent>
  );
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

export const renderCalculatorModal = (
  locationListItem: Pick<LocationList, 'locationName' | 'locationType' | 'palletId'>,
  showCalcModal: boolean,
  setShowCalcModal: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>
) => {
  const { locationName, palletId } = locationListItem;
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
          dispatch(updatePalletQty(palletId, calcValue));
          setShowCalcModal(false);
        }
      }}
    />
  );
};

export const qtyStyleChange = (
  oldQty: number,
  newQty: number
): Record<string, unknown> => {
  if (newQty > oldQty) {
    return styles.positiveChange;
  }
  return styles.negativeChange;
};

export const renderConfirmOnHandsModal = (
  updateMultiPalletUPCQtyV2Api: AsyncState,
  showOnHandsConfirmationModal: boolean,
  setShowOnHandsConfirmationModal: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  itemDetails: ItemDetails | null,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  reserveLocations: ItemPalletInfo[],
  peteGetPallets: boolean
) => {
  const newPalletList: UpdateMultiPalletUPCQtyRequest['PalletList'] = reserveLocations.map(item => (
    {
      palletId: item.palletId,
      expirationDate: '', // This is fine as it does not update the expiration date on the pallet
      upcs: [{ upcNbr: peteGetPallets ? item.upcNbr : itemDetails?.upcNbr || '0', quantity: item.newQty }]
    }
  ));

  return (
    <CustomModalComponent
      isVisible={showOnHandsConfirmationModal}
      onClose={() => setShowOnHandsConfirmationModal(false)}
      modalType="Popup"
      minHeight={150}
    >
      {updateMultiPalletUPCQtyV2Api.isWaiting ? (
        <ActivityIndicator
          animating={updateMultiPalletUPCQtyV2Api.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
          <MaterialCommunityIcon
            name="information"
            size={40}
            color={COLOR.DISABLED_BLUE}
          />
          <Text style={styles.confirmText}>
            {strings('ITEM.RESERVE_CONFIRMATION')}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              title={strings('APPROVAL.GO_BACK')}
              titleColor={COLOR.MAIN_THEME_COLOR}
              testID="modal-cancel-button"
              onPress={() => {
                trackEventCall(SCREEN_NAME, {
                  action: 'cancel_multi_OH_qty_update', itemNumber: itemDetails?.itemNbr, upcNbr: itemDetails?.upcNbr
                });
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
                  SCREEN_NAME,
                  {
                    action: 'update_multi_pallet_qty',
                    type: 'multi_OH_qty_update',
                    itemNumber: itemDetails?.itemNbr,
                    upcNbr: itemDetails?.upcNbr
                  }
                );
                dispatch(updateMultiPalletUPCQtyV2({
                  itemNbr: itemDetails?.itemNbr,
                  PalletList: newPalletList
                }));
              }}
              disabled={itemDetails === null}
            />
          </View>
        </>
      )}
    </CustomModalComponent>
  );
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
const ItemSeparator = () => <View style={styles.separator} />;

export const disabledContinue = (
  reserveLocations: ItemPalletInfo[],
  scanRequired: boolean,
  getItemPalletApiLoading: boolean
): boolean => getItemPalletApiLoading || reserveLocations.length === 0 || reserveLocations.some(
  loc => (scanRequired && !loc.scanned) || (loc.newQty || loc.quantity || -1) < 0
);
export const updateMultiPalletUPCQtyV2ApiHook = (
  updateMultiPalletUPCQtyV2Api: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowOnHandsConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  itemNbr: number
) => {
  if (navigation.isFocused()) {
    if (!updateMultiPalletUPCQtyV2Api.isWaiting && updateMultiPalletUPCQtyV2Api.result) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: strings('ITEM.UPDATE_MULTI_PALLET_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });

      dispatch({ type: UPDATE_MULTI_PALLET_UPC_QTY_V2.RESET });
      setShowOnHandsConfirmationModal(false);
      dispatch(setScannedEvent({ type: 'worklist', value: itemNbr.toString() }));
      navigation.goBack();
    }
    if (!updateMultiPalletUPCQtyV2Api.isWaiting && updateMultiPalletUPCQtyV2Api.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('ITEM.UPDATE_MULTI_PALLET_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      dispatch({ type: UPDATE_MULTI_PALLET_UPC_QTY_V2.RESET });
    }
  }
};

export const ReserveAdjustmentScreen = (props: ReserveAdjustmentScreenProps): JSX.Element => {
  const {
    route,
    dispatch,
    navigation,
    trackEventCall,
    validateSessionCall,
    useEffectHook,
    useCallbackHook,
    useFocusEffectHook,
    userConfig,
    countryCode,
    getItemPalletsApi,
    itemDetails,
    reserveLocations,
    getItemPalletsError,
    setGetItemPalletsError,
    userId,
    locToConfirm,
    setLocToConfirm,
    showDeleteConfirmationState,
    deletePalletApi,
    deleteUpcsApi,
    isManualScanEnabled,
    scannedEvent,
    scannedPalletId,
    showPalletQtyModalState,
    updateMultiPalletUPCQtyV2Api,
    locationListState,
    showCalcModalState,
    showOnHandsConfirmState,
    getItemPalletsDispatch
  } = props;
  const [showPalletQtyUpdateModal, setShowPalletQtyUpdateModal] = showPalletQtyModalState;
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = showDeleteConfirmationState;
  const [showCalcModal, setShowCalcModal] = showCalcModalState;
  const [location, setLocation] = locationListState;
  const [showOnHandsConfirmationModal, setShowOnHandsConfirmationModal] = showOnHandsConfirmState;

  const MIN = 0;
  const MAX = 9999;

  const handleDeletePalletSuccess = (type: string) => {
    setShowDeleteConfirmationModal(false);
    // reset locToConfirm
    setLocToConfirm({
      locationName: '',
      locationArea: '',
      locationIndex: -1,
      locationTypeNbr: -1,
      sectionId: 0,
      palletId: 0,
      mixedPallet: false
    });
    const updatedReserveLocations = reserveLocations.filter(loc => loc.palletId !== locToConfirm.palletId);
    dispatch(setReserveLocations(updatedReserveLocations));
    dispatch({ type });
  };

  const handleReserveLocsRetry = () => {
    validateSessionCall(navigation, route.name).then(() => {
      if (itemDetails?.itemNbr) {
        dispatch({ type: GET_ITEM_PALLETS.RESET });
        setGetItemPalletsError(false);
        dispatch(getItemPalletsDispatch({ itemNbr: itemDetails.itemNbr }));
      }
    }).catch(() => {
      trackEventCall(SCREEN_NAME, { action: 'session_timeout', user: userId });
    });
  };

  const handleDeleteReserveLocation = (loc: ItemPalletInfo, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall(SCREEN_NAME,
        { action: 'report_missing_pallet_click', location: JSON.stringify(loc), index: locIndex });
      setLocToConfirm({
        locationName: loc.locationName,
        locationArea: 'reserve',
        locationIndex: locIndex,
        locationTypeNbr: 0,
        palletId: loc.palletId,
        sectionId: loc.sectionId,
        mixedPallet: loc.mixedPallet
      });
      setShowDeleteConfirmationModal(true);
    }).catch(() => {
      trackEventCall(SCREEN_NAME, { action: 'session_timeout', user: userId });
    });
  };

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name)
      .then(() => {
        trackEventCall(
          SCREEN_NAME,
          { action: 'refresh_reserve_loc', itemNumber: itemDetails?.itemNbr });
        if (itemDetails?.itemNbr) {
          dispatch(getItemPalletsDispatch({ itemNbr: itemDetails.itemNbr }));
        }
      })
      .catch(() => {
        trackEventCall(SCREEN_NAME, { action: 'session_timeout', user: userId });
      });
  };

  // Scanned Pallet Event Listener
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

  // Scanner listener
  useEffectHook(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused() && userConfig.scanRequired) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall(SCREEN_NAME, {
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
      dispatch(resetScannedEvent());
    };
  }, []);

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSession(navigation, route.name).then(() => {
        if (itemDetails?.itemNbr) {
          dispatch(getItemPalletsDispatch({ itemNbr: itemDetails.itemNbr }));
        }
      });
    }, [navigation])
  );

  useEffectHook(() => {
    // on delete pallet api success
    if (navigation.isFocused() && !deletePalletApi.isWaiting && deletePalletApi.result && showDeleteConfirmationModal) {
      handleDeletePalletSuccess(DELETE_PALLET.RESET);
    }
  }, [deletePalletApi]);

  useEffectHook(() => {
    // on delete upc from pallet api success
    if (navigation.isFocused() && !deleteUpcsApi.isWaiting && deleteUpcsApi.result && showDeleteConfirmationModal) {
      if (deleteUpcsApi.result.status === 200) {
        handleDeletePalletSuccess(DELETE_UPCS.RESET);
      }
    }
  }, [deleteUpcsApi]);

  // Get Pallets api
  useEffectHook(
    () => getItemPalletsApiHook(getItemPalletsApi, dispatch, navigation, reserveLocations, setGetItemPalletsError),
    [getItemPalletsApi]
  );

  // Update Multiple Pallet's UPC Qty API
  useEffectHook(() => updateMultiPalletUPCQtyV2ApiHook(
    updateMultiPalletUPCQtyV2Api,
    dispatch,
    navigation,
    setShowOnHandsConfirmationModal,
    itemDetails?.itemNbr || 0
  ), [updateMultiPalletUPCQtyV2Api]);

  return (
    <View style={styles.container}>
      {renderDeleteLocationModal(
        deletePalletApi,
        deleteUpcsApi,
        showDeleteConfirmationModal,
        setShowDeleteConfirmationModal,
        trackEventCall,
        dispatch,
        locToConfirm,
        itemDetails?.upcNbr
      )}
      {renderpalletQtyUpdateModal(
        scannedPalletId,
        reserveLocations,
        dispatch,
        showPalletQtyUpdateModal,
        setShowPalletQtyUpdateModal,
        userConfig.showCalculator,
        itemDetails?.vendorPackQty
      )}
      {renderConfirmOnHandsModal(
        updateMultiPalletUPCQtyV2Api,
        showOnHandsConfirmationModal,
        setShowOnHandsConfirmationModal,
        itemDetails,
        dispatch,
        trackEventCall,
        reserveLocations,
        userConfig.peteGetPallets
      )}
      {(renderCalculatorModal(location, showCalcModal, setShowCalcModal, dispatch))}
      {isManualScanEnabled && (
      <ManualScanComponent placeholder={strings('LOCATION.PALLET')} />
      )}
      <View style={styles.marginBottomStyles}>
        <ItemCard
          itemNumber={itemDetails ? itemDetails.itemNbr : 0}
          description={itemDetails ? itemDetails.itemName : ''}
          onHandQty={itemDetails ? itemDetails.onHandsQty : 0}
          loading={false}
          disabled
          countryCode={countryCode}
          showItemImage={userConfig.showItemImage}
          showOHItems
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        <LocationListCard
          locationList={getReserveLocationList(
            reserveLocations,
            dispatch,
            handleDeleteReserveLocation,
            setLocation,
            setShowCalcModal
          )}
          locationType="reserve"
          loading={getItemPalletsApi.isWaiting}
          error={getItemPalletsError}
          scanRequired={userConfig.scanRequired}
          onRetry={handleReserveLocsRetry}
          showCalculator={userConfig.showCalculator}
          minQty={MIN}
          maxQty={MAX}
        />
      </ScrollView>
      <ItemSeparator />
      <View style={{ backgroundColor: COLOR.WHITE }}>
        <Button
          title={strings('GENERICS.CONTINUE')}
          style={styles.buttonWrapper}
          type={ButtonType.PRIMARY}
          disabled={disabledContinue(reserveLocations, userConfig.scanRequired, getItemPalletsApi.isWaiting)}
            // TODO: dispatch action needs to be called when clicking submit
          onPress={() => {
            trackEventCall(SCREEN_NAME, { action: 'continue_action_click' });
            setShowOnHandsConfirmationModal(true);
          }}
        />
      </View>
    </View>
  );
};

const ReserveAdjustment = (): JSX.Element => {
  const { countryCode, userId, configs: userConfig } = useTypedSelector(state => state.User);
  const getItemPalletsApi = userConfig.peteGetPallets ? useTypedSelector(state => state.async.getItemPalletsV1)
    : useTypedSelector(state => state.async.getItemPallets);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const deletePalletApi = useTypedSelector(state => state.async.deletePallet);
  const updateMultiPalletUPCQtyV2Api = useTypedSelector(state => state.async.updateMultiPalletUPCQtyV2);
  const { itemDetails, reserveLocations, scannedPalletId } = useTypedSelector(state => state.ReserveAdjustmentScreen);
  const { isManualScanEnabled, scannedEvent } = useTypedSelector(state => state.Global);
  const showPalletQtyModalState = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [getItemPalletsError, setGetItemPalletsError] = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '',
    locationArea: '',
    locationIndex: -1,
    locationTypeNbr: -1,
    sectionId: 0,
    palletId: 0,
    mixedPallet: false
  });
  const showDeleteConfirmationState = useState(false);
  const showCalcModalState = useState(false);
  const showOnHandsConfirmState = useState(false);
  const locationListState = useState({
    locationName: '',
    locationType: 'floor',
    palletId: '-1'
  });
  const getItemPalletsDispatch = userConfig.peteGetPallets ? getItemPalletsV1 : getItemPallets;
  return (
    <ReserveAdjustmentScreen
      getItemPalletsApi={getItemPalletsApi}
      getItemPalletsDispatch={getItemPalletsDispatch}
      route={route}
      dispatch={dispatch}
      navigation={navigation}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
      useCallbackHook={useCallback}
      userConfig={userConfig}
      countryCode={countryCode}
      itemDetails={itemDetails}
      reserveLocations={reserveLocations}
      getItemPalletsError={getItemPalletsError}
      setGetItemPalletsError={setGetItemPalletsError}
      userId={userId}
      showDeleteConfirmationState={showDeleteConfirmationState}
      locToConfirm={locToConfirm}
      setLocToConfirm={setLocToConfirm}
      deleteUpcsApi={deleteUpcsApi}
      deletePalletApi={deletePalletApi}
      isManualScanEnabled={isManualScanEnabled}
      scannedEvent={scannedEvent}
      scannedPalletId={scannedPalletId}
      showPalletQtyModalState={showPalletQtyModalState}
      updateMultiPalletUPCQtyV2Api={updateMultiPalletUPCQtyV2Api}
      showCalcModalState={showCalcModalState}
      // @ts-expect-error typechecking error with location type
      locationListState={locationListState}
      showOnHandsConfirmState={showOnHandsConfirmState}
    />
  );
};

export default ReserveAdjustment;
