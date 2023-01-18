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
import { DELETE_PALLET, DELETE_UPCS, GET_ITEM_PALLETS } from '../../../state/actions/asyncAPI';
import { deletePallet, deleteUpcs, getItemPallets } from '../../../state/actions/saga';
import {
  setReserveLocations, setScannedPalletId, updatePalletQty, updatePalletScannedStatus
} from '../../../state/actions/ReserveAdjustmentScreen';
import styles from './ReserveAdjustment.style';
import ManualScanComponent from '../../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../../utils/scannerUtils';
import { resetScannedEvent, setScannedEvent } from '../../../state/actions/Global';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import PalletQtyUpdate from '../../../components/PalletQtyUpdate/PalletQtyUpdate';

export interface ReserveAdjustmentScreenProps {
    getItemPalletsApi: AsyncState;
    deleteUpcsApi: AsyncState;
    deletePalletApi: AsyncState;
    reserveLocations: ItemPalletInfo[];
    route: RouteProp<any, string>;
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    trackEventCall: (eventName: string, params?: any) => void;
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
    showPalletQtyUpdateModal: boolean;
    setShowPalletQtyUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
    showDeleteConfirmationModal: boolean;
    setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  handleDeleteReserveLocation: (loc: ItemPalletInfo, locIndex: number) => void
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
        onCalcPress: () => {}
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
        const { data } = getItemPalletsApi.result;
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
                trackEventCall('Reserve_Adjustment_Screen', { action: 'cancel_delete_location_click' });
              }}
            />
            <Button
              style={styles.button}
              title={apiHasError ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
              testID="modal-confirm-button"
              backgroundColor={COLOR.TRACKER_RED}
              onPress={() => {
                trackEventCall('Reserve_Adjustment_Screen',
                  { action: 'missing_pallet_confirmation_click', palletId: locToConfirm.palletId });
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
): boolean => getItemPalletApiLoading || reserveLocations.some(
  loc => (scanRequired && !loc.scanned) || (loc.newQty || loc.quantity || -1) < 0
);

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
    setShowDeleteConfirmationModal,
    showDeleteConfirmationModal,
    deletePalletApi,
    deleteUpcsApi,
    isManualScanEnabled,
    scannedEvent,
    scannedPalletId,
    showPalletQtyUpdateModal,
    setShowPalletQtyUpdateModal
  } = props;

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
        dispatch(getItemPallets({ itemNbr: itemDetails.itemNbr }));
      }
    }).catch(() => {
      trackEventCall('Reserve_Adjustment_Screen', { action: 'session_timeout', user: userId });
    });
  };

  const handleDeleteReserveLocation = (loc: ItemPalletInfo, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('Audit_Item',
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
      trackEventCall('Reserve_Adjustment_Screen', { action: 'session_timeout', user: userId });
    });
  };

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name)
      .then(() => {
        trackEventCall('Reserve_Adjustment_Screen',
          { action: 'refresh_reserve_loc', itemNumber: itemDetails?.itemNbr });
        if (itemDetails?.itemNbr) {
          dispatch(getItemPallets({ itemNbr: itemDetails.itemNbr }));
        }
      })
      .catch(() => {
        trackEventCall('Reserve_Adjustment_Screen', { action: 'session_timeout', user: userId });
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
      dispatch(resetScannedEvent());
    };
  }, []);

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSession(navigation, route.name).then(() => {
        if (itemDetails?.itemNbr) {
          dispatch(getItemPallets({ itemNbr: 720 }));
        }
      });
    }, [navigation])
  );

  useEffect(() => {
    // on delete pallet api success
    if (navigation.isFocused() && !deletePalletApi.isWaiting && deletePalletApi.result && showDeleteConfirmationModal) {
      handleDeletePalletSuccess(DELETE_PALLET.RESET);
    }
  }, [deletePalletApi]);

  useEffect(() => {
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
          locationList={getReserveLocationList(reserveLocations, dispatch, handleDeleteReserveLocation)}
          locationType="reserve"
          loading={getItemPalletsApi.isWaiting}
          error={getItemPalletsError}
          scanRequired={userConfig.scanRequired}
          onRetry={handleReserveLocsRetry}
          showCalculator={userConfig.showCalculator}
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
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const ReserveAdjustment = (): JSX.Element => {
  const getItemPalletsApi = useTypedSelector(state => state.async.getItemPallets);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const deletePalletApi = useTypedSelector(state => state.async.deletePallet);
  const { itemDetails, reserveLocations, scannedPalletId } = useTypedSelector(state => state.ReserveAdjustmentScreen);
  const { countryCode, userId, configs: userConfig } = useTypedSelector(state => state.User);
  const { isManualScanEnabled, scannedEvent } = useTypedSelector(state => state.Global);
  const [showPalletQtyUpdateModal, setShowPalletQtyUpdateModal] = useState(false);
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
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  return (
    <ReserveAdjustmentScreen
      getItemPalletsApi={getItemPalletsApi}
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
      showDeleteConfirmationModal={showDeleteConfirmationModal}
      setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
      locToConfirm={locToConfirm}
      setLocToConfirm={setLocToConfirm}
      deleteUpcsApi={deleteUpcsApi}
      deletePalletApi={deletePalletApi}
      isManualScanEnabled={isManualScanEnabled}
      scannedEvent={scannedEvent}
      scannedPalletId={scannedPalletId}
      showPalletQtyUpdateModal={showPalletQtyUpdateModal}
      setShowPalletQtyUpdateModal={setShowPalletQtyUpdateModal}
    />
  );
};

export default ReserveAdjustment;