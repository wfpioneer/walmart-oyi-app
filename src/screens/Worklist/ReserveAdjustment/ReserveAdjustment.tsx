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
import { GET_ITEM_PALLETS, REPORT_MISSING_PALLET } from '../../../state/actions/asyncAPI';
import { getItemPallets, reportMissingPallet } from '../../../state/actions/saga';
import {
  setReserveLocations
} from '../../../state/actions/ReserveAdjustmentScreen';
import styles from './ReserveAdjustment.style';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';

export interface ReserveAdjustmentScreenProps {
    getItemPalletsApi: AsyncState;
    reportMissingPalletApi: AsyncState;
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
  }

const getReserveLocationList = (
  locations: ItemPalletInfo[],
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
        scanned: loc.scanned,
        palletId: loc.palletId,
        locationType: 'reserve',
        increment: () => {},
        decrement: () => {},
        onDelete: () => handleDeleteReserveLocation(loc, locIndex),
        qtyChange: () => {},
        onEndEditing: () => {},
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

export const reportMissingPalletApiHook = (
  reportMissingPalletApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  palletId: number,
  itemNbr?: number
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
        if (itemNbr) {
          dispatch(getItemPallets({ itemNbr }));
        }
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

export const renderDeleteLocationModal = (
  reportMissingPalletApi: AsyncState,
  showDeleteConfirmationModal: boolean,
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>,
  palletId: number,
  trackEventCall: (eventName: string, params?: any) => void,
  dispatch: Dispatch<any>,
  locToConfirm: {
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
    palletId: number;
    sectionId: number;
  }
) => (
  <CustomModalComponent
    isVisible={showDeleteConfirmationModal}
    onClose={() => setShowDeleteConfirmationModal(false)}
    modalType="Error"
    minHeight={100}
  >
    {reportMissingPalletApi.isWaiting ? (
      <ActivityIndicator
        animating={reportMissingPalletApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    ) : (
      <>
        <Text style={styles.message}>
          {reportMissingPalletApi.error
            ? strings('WORKLIST.MISSING_PALLET_API_ERROR')
            : `${strings('WORKLIST.MISSING_PALLET_CONFIRMATION', { palletId })}`}
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
            title={reportMissingPalletApi.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
            testID="modal-confirm-button"
            backgroundColor={COLOR.TRACKER_RED}
            onPress={() => {
              trackEventCall('Reserve_Adjustment_Screen',
                { action: 'missing_pallet_confirmation_click', palletId });
              dispatch(
                reportMissingPallet({
                  palletId: locToConfirm.palletId,
                  locationName: locToConfirm.locationName,
                  sectionId: locToConfirm.sectionId
                })
              );
            }}
          />
        </View>
      </>
    )}
  </CustomModalComponent>
);

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
    reportMissingPalletApi
  } = props;

  const handleReserveLocsRetry = () => {
    validateSessionCall(navigation, route.name).then(() => {
      if (itemDetails?.itemNbr) {
        dispatch({ type: GET_ITEM_PALLETS.RESET });
        setGetItemPalletsError(false);
        dispatch(getItemPallets({ itemNbr: itemDetails.itemNbr }));
      }
    }).catch(() => { });
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
        sectionId: loc.sectionId
      });
      setShowDeleteConfirmationModal(true);
    }).catch(() => { });
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

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSession(navigation, route.name).then(() => {
        if (itemDetails?.itemNbr) {
          dispatch(getItemPallets({ itemNbr: itemDetails.itemNbr }));
        }
      });
    }, [navigation])
  );

  // report missing pallet API
  useEffectHook(
    () => reportMissingPalletApiHook(
      reportMissingPalletApi, dispatch, navigation,
      setShowDeleteConfirmationModal, locToConfirm.palletId, itemDetails?.itemNbr
    ),
    [reportMissingPalletApi]
  );

  // Get Pallets api
  useEffectHook(
    () => getItemPalletsApiHook(getItemPalletsApi, dispatch, navigation, reserveLocations, setGetItemPalletsError),
    [getItemPalletsApi]
  );

  return (
    <View style={styles.container}>
      {renderDeleteLocationModal(
        reportMissingPalletApi,
        showDeleteConfirmationModal,
        setShowDeleteConfirmationModal,
        locToConfirm.palletId,
        trackEventCall,
        dispatch,
        locToConfirm
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
          locationList={getReserveLocationList(reserveLocations, handleDeleteReserveLocation)}
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
  const reportMissingPalletApi = useTypedSelector(state => state.async.reportMissingPallet);
  const { itemDetails, reserveLocations } = useTypedSelector(state => state.ReserveAdjustmentScreen);
  const { countryCode, userId, configs: userConfig } = useTypedSelector(state => state.User);
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
    palletId: 0
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
      reportMissingPalletApi={reportMissingPalletApi}
    />
  );
};

export default ReserveAdjustment;
