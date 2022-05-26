import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, BackHandler, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-toast-message';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosError, AxiosResponse } from 'axios';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  addToPicklist, createNewPick, getItemDetails, noAction
} from '../../state/actions/saga';
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
import CreatePickDialog from '../../components/CreatePickDialog/CreatePickDialog';
import { resetLocations, setActionCompleted, setupScreen } from '../../state/actions/ItemDetailScreen';
import { hideActivityModal, showActivityModal, showInfoModal } from '../../state/actions/Modal';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import Location from '../../models/Location';
import { AsyncState } from '../../models/AsyncState';
import {
  ADD_TO_PICKLIST, CREATE_NEW_PICK, GET_ITEM_DETAILS, NO_ACTION
} from '../../state/actions/asyncAPI';
import { CustomModalComponent } from '../Modal/Modal';
import ItemDetailsList, { ItemDetailsListRow } from '../../components/ItemDetailsList/ItemDetailsList';
import { Configurations } from '../../models/User';
import { CreatePickRequest } from '../../services/Picking.service';
import { MOVE_TO_FRONT } from '../CreatePick/CreatePick';

export const COMPLETE_API_409_ERROR = 'Request failed with status code 409';
const ITEM_SCAN_DOESNT_MATCH = 'ITEM.SCAN_DOESNT_MATCH';
const ITEM_SCAN_DOESNT_MATCH_DETAILS = 'ITEM.SCAN_DOESNT_MATCH_DETAILS';

const GENERICS_ADD = 'GENERICS.ADD';
const GENERICS_ENTER_UPC = 'GENERICS.ENTER_UPC_ITEM_NBR';

export interface ItemDetailsScreenProps {
  scannedEvent: { value: string | null; type: string | null; };
  isManualScanEnabled: boolean;
  isWaiting: boolean; error: AxiosError | null; result: AxiosResponse | null;
  addToPicklistStatus: AsyncState;
  completeItemApi: AsyncState;
  createNewPickApi: AsyncState;
  userId: string;
  exceptionType: string | null | undefined; actionCompleted: boolean; pendingOnHandsQty: number;
  floorLocations?: Location[];
  reserveLocations?: Location[];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  scrollViewRef: RefObject<ScrollView>;
  isSalesMetricsGraphView: boolean; setIsSalesMetricsGraphView: React.Dispatch<React.SetStateAction<boolean>>;
  ohQtyModalVisible: boolean; setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  createPickModalVisible: boolean; setCreatePickModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errorModalVisible: boolean; setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSection: string; setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
  numberOfPallets: number; setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>;
  isQuickPick: boolean; setIsQuickPick: React.Dispatch<React.SetStateAction<boolean>>;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  useFocusEffectHook: (effect: EffectCallback) => void;
  userFeatures: string[];
  userConfigs: Configurations
}

export interface HandleProps {
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
  userConfigs: Configurations;
}

export const handleUpdateQty = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, setOhQtyModalVisible, userId
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall('item_details_oh_quantity_update_click', { itemDetails: JSON.stringify(itemDetails) });
    setOhQtyModalVisible(true);
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

export const handleLocationAction = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, userId
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall('item_details_location_details_click', { itemDetails: JSON.stringify(itemDetails) });
    navigation.navigate('LocationDetails');
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

export const handleAddToPicklist = (props: HandleProps, itemDetails: ItemDetails) => {
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

export const renderOHQtyComponent = (itemDetails: ItemDetails): JSX.Element => {
  const {
    pendingOnHandsQty,
    onHandsQty,
    backroomQty,
    claimsOnHandQty,
    consolidatedOnHandQty,
    cloudQty,
    inTransitCloudQty
  } = itemDetails;

  const salesFloorQty = cloudQty === undefined
    ? onHandsQty - (backroomQty + claimsOnHandQty + consolidatedOnHandQty)
    : onHandsQty
    - (backroomQty + claimsOnHandQty + consolidatedOnHandQty + cloudQty);

  const onHandsRow: ItemDetailsListRow = {
    label: strings('ITEM.ON_HANDS'),
    value: onHandsQty
  };

  if (pendingOnHandsQty !== -999) {
    onHandsRow.value = `${onHandsQty} (${pendingOnHandsQty})`;
    onHandsRow.additionalNote = strings('ITEM.PENDING_MGR_APPROVAL');
  }

  const qtyRows: ItemDetailsListRow[] = [
    onHandsRow,
    { label: strings('ITEM.SALES_FLOOR_QTY'), value: salesFloorQty },
    { label: strings('ITEM.RESERVE_QTY'), value: backroomQty },
    { label: strings('ITEM.CLAIMS_QTY'), value: claimsOnHandQty },
    { label: strings('ITEM.CONSOLIDATED_QTY'), value: consolidatedOnHandQty }
  ];

  if (cloudQty !== undefined) {
    qtyRows.push({ label: strings('ITEM.FLY_CLOUD_QTY'), value: cloudQty });
  }

  if (inTransitCloudQty !== undefined) {
    qtyRows.push({ label: strings('ITEM.IN_TRANSIT_FLY_QTY'), value: inTransitCloudQty });
  }

  return <ItemDetailsList rows={qtyRows} indentAfterFirstRow={true} />;
};

export const createNewPickApiHook = (
  createNewPickApi: AsyncState,
  dispatch: Dispatch<any>,
  isFocused: boolean,
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>,
  setIsQuickPick: React.Dispatch<React.SetStateAction<boolean>>,
  setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
): void => {
  if (isFocused && !createNewPickApi.isWaiting) {
    // create new pick api success
    if (createNewPickApi.result && createNewPickApi.result.status === 200) {
      Toast.show({
        type: 'success',
        text1: strings('PICKING.CREATE_NEW_PICK_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      // Reset the form inputs on success
      setSelectedSection('');
      setIsQuickPick(false);
      setNumberOfPallets(1);
      // Reset the create new pick API
      dispatch({ type: CREATE_NEW_PICK.RESET });
      dispatch(hideActivityModal());
    }
    // create new pick api error
    if (createNewPickApi.error) {
      const errResponse = createNewPickApi.error.response;
      if (errResponse && errResponse.status === 409
        && errResponse.data.errorEnum === 'PICK_REQUEST_CRITERIA_ALREADY_MET') {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.PICK_REQUEST_CRITERIA_ALREADY_MET'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.CREATE_NEW_PICK_FAILURE'),
          text2: strings('GENERICS.TRY_AGAIN'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
      dispatch({ type: CREATE_NEW_PICK.RESET });
      dispatch(hideActivityModal());
    }
  }
  // create new pick api isWaiting
  if (isFocused && createNewPickApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const renderAddPicklistButton = (
  props: (RenderProps & HandleProps),
  itemDetails: ItemDetails,
  setCreatePickModalVisible: React.Dispatch<React.SetStateAction<boolean>>
): JSX.Element => {
  const { reserve } = itemDetails.location;
  const { addToPicklistStatus, userConfigs } = props;
  if (addToPicklistStatus?.isWaiting) {
    return (
      <ActivityIndicator
        animating={addToPicklistStatus?.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
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
          title={strings(GENERICS_ADD) + strings('ITEM.TO_PICKLIST')}
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
        title={strings(GENERICS_ADD) + strings('ITEM.TO_PICKLIST')}
        titleColor={COLOR.MAIN_THEME_COLOR}
        titleFontSize={12}
        titleFontWeight="bold"
        height={28}
        onPress={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          userConfigs.picking ? setCreatePickModalVisible(true) : handleAddToPicklist(props, itemDetails);
        }}
      />
    );
  }

  return <Text>{strings('ITEM.RESERVE_NEEDED')}</Text>;
};

export const renderLocationComponent = (
  props: (RenderProps & HandleProps),
  itemDetails: ItemDetails,
  setCreatePickModalVisible: React.Dispatch<React.SetStateAction<boolean>>
): JSX.Element => {
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
              title={strings(GENERICS_ADD)}
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
              title={strings(GENERICS_ADD)}
              titleColor={COLOR.MAIN_THEME_COLOR}
              titleFontSize={12}
              titleFontWeight="bold"
              height={28}
              onPress={() => handleLocationAction(props, itemDetails)}
            />
          )}
      </View>
      <View style={styles.renderPickListContainer}>
        {renderAddPicklistButton(props, itemDetails, setCreatePickModalVisible)}
      </View>
    </View>
  );
};

const MULTI_STATUS = 207;

export const renderSalesGraph = (updatedSalesTS: string | undefined, toggleSalesGraphView: any,
  result: any, itemDetails: ItemDetails, isSalesMetricsGraphView: boolean): JSX.Element => {
  if (result && result.status !== MULTI_STATUS) {
    return (
      <SFTCard
        title={strings('ITEM.SALES_METRICS')}
        subTitle={updatedSalesTS}
        bottomRightBtnTxt={[strings('ITEM.TOGGLE_GRAPH')]}
        bottomRightBtnAction={[toggleSalesGraphView]}
      >
        <SalesMetrics itemDetails={itemDetails} isGraphView={isSalesMetricsGraphView} />
      </SFTCard>
    );
  }
  return (
    <View>
      <View style={styles.activityIndicator}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_500} />
        <Text>{strings('ITEM.ERROR_SALES_HISTORY')}</Text>
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
  <CustomModalComponent
    isVisible={isVisible}
    modalType="Error"
    onClose={() => setIsVisible(false)}
  >
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
  </CustomModalComponent>
);
export const getFloorItemDetails = (itemDetails: ItemDetails) => (itemDetails.location && itemDetails.location.floor
  ? itemDetails.location.floor : []);

export const getReserveItemDetails = (itemDetails: ItemDetails) => (itemDetails.location && itemDetails.location.reserve
  ? itemDetails.location.reserve : []);

export const isItemDetailsCompleted = (itemDetails: ItemDetails) => (itemDetails.exceptionType
  ? itemDetails.completed : true);

export const onValidateItemDetails = (dispatch: Dispatch<any>, itemDetails: ItemDetails) => {
  if (itemDetails) {
    dispatch(setupScreen(
      itemDetails.itemNbr,
      itemDetails.upcNbr,
      getFloorItemDetails(itemDetails),
      getReserveItemDetails(itemDetails),
      itemDetails.exceptionType,
      itemDetails.pendingOnHandsQty,
      isItemDetailsCompleted(itemDetails),
      true
    ));
  }
};

export const callBackbarcodeEmitter = (props: ItemDetailsScreenProps, scan: any, itemDetails: ItemDetails) => {
  const {
    userId,
    actionCompleted,
    route,
    dispatch,
    navigation,
    setErrorModalVisible,
    trackEventCall,
    validateSessionCall
  } = props;
  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall('item_details_scan', { value: scan.value, type: scan.type });
      if (!(scan.type.includes('QR Code') || scan.type.includes('QRCODE'))) {
        if (itemDetails && itemDetails.exceptionType && !actionCompleted) {
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
};

export const handleCreateNewPick = (
  props: ItemDetailsScreenProps,
  itemDetails: ItemDetails,
  setCreatePickModalVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const {
    numberOfPallets, isQuickPick, selectedSection, dispatch, floorLocations
  } = props;
  const {
    itemNbr, upcNbr, categoryNbr, itemName
  } = itemDetails;
  const locationDetails = floorLocations?.find(loc => loc.locationName === selectedSection);
  const createPickPayload: CreatePickRequest = {
    itemNbr,
    upcNbr,
    itemDesc: itemName,
    category: categoryNbr,
    salesFloorLocationName: selectedSection,
    salesFloorLocationId: locationDetails?.sectionId,
    moveToFront: selectedSection === MOVE_TO_FRONT,
    numberOfPallets,
    quickPick: isQuickPick
  };
  setCreatePickModalVisible(false);
  dispatch(createNewPick(createPickPayload));
};

export const onValidateBackPress = (props: ItemDetailsScreenProps) => {
  const {
    exceptionType, actionCompleted, dispatch, trackEventCall
  } = props;
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

export const onValidateScannedEvent = (props: ItemDetailsScreenProps) => {
  const {
    scannedEvent, userId, route,
    dispatch, navigation, trackEventCall,
    validateSessionCall
  } = props;

  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name).then(() => {
      if (scannedEvent.value) {
        dispatch({ type: GET_ITEM_DETAILS.RESET });
        dispatch(getItemDetails({ id: parseInt(scannedEvent.value, 10) }));
        dispatch({ type: ADD_TO_PICKLIST.RESET });
      }
    }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
  }
};

export const onIsWaiting = (isWaiting: boolean) => (
  isWaiting && (
    <ActivityIndicator
      animating={isWaiting}
      hidesWhenStopped
      color={COLOR.MAIN_THEME_COLOR}
      size="large"
      style={styles.activityIndicator}
    />
  )
);

export const onValidateCompleteItemApiResultHook = (props: ItemDetailsScreenProps, completeItemApi: AsyncState) => {
  const { dispatch, navigation } = props;
  if (_.get(completeItemApi.result, 'status') === 204) {
    dispatch(showInfoModal(strings('ITEM.SCAN_DOESNT_MATCH'), strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')));
  } else {
    dispatch(setActionCompleted());
    navigation.goBack();
  }
};

export const onValidateCompleteItemApiErrortHook = (props: ItemDetailsScreenProps, completeItemApi: AsyncState) => {
  const { dispatch } = props;
  if (completeItemApi.error === COMPLETE_API_409_ERROR) {
    dispatch(showInfoModal(strings(ITEM_SCAN_DOESNT_MATCH), strings(ITEM_SCAN_DOESNT_MATCH_DETAILS)));
  } else {
    dispatch(showInfoModal(strings('ITEM.ACTION_COMPLETE_ERROR'), strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS')));
  }
};

export const getLocationCount = (props: ItemDetailsScreenProps) => {
  const { floorLocations, reserveLocations } = props;
  return (floorLocations?.length ?? 0) + (reserveLocations?.length ?? 0);
};

export const getUpdatedSales = (itemDetails: ItemDetails) => (_.get(itemDetails, 'sales.lastUpdateTs')
  ? `${strings('GENERICS.UPDATED')} ${moment(itemDetails.sales.lastUpdateTs).format('dddd, MMM DD hh:mm a')}`
  : undefined);

export const isError = (
  error: AxiosError | null,
  errorModalVisible: boolean,
  setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isManualScanEnabled: boolean,
  scannedEvent: { value: string | null; type: string | null; },
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void
) => {
  if (error) {
    const scannedValue = scannedEvent.value || '';
    return (
      <View style={styles.safeAreaView}>
        {renderBarcodeErrorModal(errorModalVisible, setErrorModalVisible)}
        {isManualScanEnabled && <ManualScanComponent placeholder={strings(GENERICS_ENTER_UPC)} />}
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
          <Text style={styles.errorText}>{strings('ITEM.API_ERROR')}</Text>
          <TouchableOpacity
            testID="scanErrorRetry"
            style={styles.errorButton}
            onPress={() => {
              trackEventCall('item_details_api_retry', { barcode: scannedValue });
              return dispatch(getItemDetails({ id: parseInt(scannedValue, 10) }));
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

export const getExceptionType = (actionCompleted: boolean, itemDetails: ItemDetails) => (!actionCompleted
  ? itemDetails.exceptionType : undefined);

export const getTopRightBtnTxt = (locationCount: number) => (locationCount && locationCount >= 1
  ? strings('GENERICS.SEE_ALL') : strings(GENERICS_ADD));

export const getPendingOnHandsQty = (userFeatures: string[], pendingOnHandsQty: number) => (pendingOnHandsQty === -999
  && userFeatures.includes('on hands change'));

export const ReviewItemDetailsScreen = (props: ItemDetailsScreenProps): JSX.Element => {
  const {
    scannedEvent, isManualScanEnabled,
    isWaiting, error, result,
    completeItemApi,
    createNewPickApi,
    userId, actionCompleted, pendingOnHandsQty,
    route,
    dispatch,
    navigation,
    scrollViewRef,
    isSalesMetricsGraphView, setIsSalesMetricsGraphView,
    ohQtyModalVisible, setOhQtyModalVisible,
    createPickModalVisible, setCreatePickModalVisible,
    errorModalVisible, setErrorModalVisible,
    selectedSection, setSelectedSection,
    numberOfPallets, setNumberOfPallets,
    isQuickPick, setIsQuickPick,
    trackEventCall,
    validateSessionCall,
    useEffectHook,
    useFocusEffectHook,
    floorLocations, userFeatures
  } = props;

  useEffectHook(() => () => {
    dispatch(resetLocations());
  }, []);

  useEffectHook(() => {
    if (floorLocations && floorLocations.length > 0) {
      setSelectedSection(floorLocations[0].locationName);
    }
  }, [floorLocations]);

  // Scanned Item Event Listener
  useEffectHook(() => {
    onValidateScannedEvent(props);
  }, [scannedEvent]);

  const itemDetails: ItemDetails = (result && result.data); // || getMockItemDetails(scannedEvent.value);
  const locationCount = getLocationCount(props);
  const updatedSalesTS = getUpdatedSales(itemDetails);

  // Set Item Details
  useEffectHook(() => {
    onValidateItemDetails(dispatch, itemDetails);
  }, [itemDetails]);

  // Barcode event listener effect
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      callBackbarcodeEmitter(props, scan, itemDetails);
    });
    return () => {
      scanSubscription.remove();
    };
  }, [itemDetails, actionCompleted]);

  // Complete Item Details API
  useEffectHook(() => {
    // on api success
    if (!completeItemApi.isWaiting && completeItemApi.result) {
      onValidateCompleteItemApiResultHook(props, completeItemApi);
      dispatch({ type: NO_ACTION.RESET });
    }
  }, [completeItemApi]);

  useEffectHook(
    () => createNewPickApiHook(
      createNewPickApi,
      dispatch,
      navigation.isFocused(),
      setSelectedSection,
      setIsQuickPick,
      setNumberOfPallets
    ),
    [createNewPickApi]
  );

  useEffectHook(() => {
    // on api failure
    if (!completeItemApi.isWaiting && completeItemApi.error) {
      onValidateCompleteItemApiErrortHook(props, completeItemApi);
      dispatch({ type: NO_ACTION.RESET });
    }
  }, [completeItemApi]);

  useFocusEffectHook(
    () => {
      const onBackPress = () => onValidateBackPress(props);

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  );

  // Get Item Details Error
  if (!isWaiting && error) {
    return isError(
      error,
      errorModalVisible,
      setErrorModalVisible,
      isManualScanEnabled,
      scannedEvent,
      dispatch,
      trackEventCall
    );
  }

  if (_.get(result, 'status') === 204) {
    return (
      <View style={styles.safeAreaView}>
        {renderBarcodeErrorModal(errorModalVisible, setErrorModalVisible)}
        {isManualScanEnabled && <ManualScanComponent placeholder={strings(GENERICS_ENTER_UPC)} />}
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
      trackEventCall('refresh_item_details', { itemNumber: itemDetails.itemNbr });
      dispatch({ type: GET_ITEM_DETAILS.RESET });
      dispatch(getItemDetails({ id: itemDetails.itemNbr }));
    }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
  };

  return (
    <View style={styles.safeAreaView}>
      {isManualScanEnabled && <ManualScanComponent placeholder={strings(GENERICS_ENTER_UPC)} />}
      {renderBarcodeErrorModal(errorModalVisible, setErrorModalVisible)}
      <CustomModalComponent
        isVisible={ohQtyModalVisible}
        onClose={() => setOhQtyModalVisible(false)}
        modalType="Form"
      >
        <OHQtyUpdate
          ohQty={itemDetails.onHandsQty}
          setOhQtyModalVisible={setOhQtyModalVisible}
          exceptionType={itemDetails.exceptionType}
        />
      </CustomModalComponent>
      <CustomModalComponent
        isVisible={createPickModalVisible}
        onClose={() => setCreatePickModalVisible(false)}
        modalType="Form"
      >
        <CreatePickDialog
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          numberOfPallets={numberOfPallets}
          setNumberOfPallets={setNumberOfPallets}
          isQuickPick={isQuickPick}
          setIsQuickPick={setIsQuickPick}
          locations={floorLocations || []}
          onClose={() => setCreatePickModalVisible(false)}
          onSubmit={() => handleCreateNewPick(props, itemDetails, setCreatePickModalVisible)}
        />
      </CustomModalComponent>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
      >
        {onIsWaiting(isWaiting)}
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
              exceptionType={getExceptionType(actionCompleted, itemDetails)}
              navigationForPrint={navigation}
            />
            <SFTCard
              title={strings('ITEM.QUANTITY')}
              iconName="pallet"
              topRightBtnTxt={getPendingOnHandsQty(userFeatures, pendingOnHandsQty)
                ? strings('GENERICS.CHANGE') : undefined}
              topRightBtnAction={() => handleUpdateQty(props, itemDetails)}
            >
              {renderOHQtyComponent({ ...itemDetails, pendingOnHandsQty })}
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
              topRightBtnTxt={getTopRightBtnTxt(locationCount)}
              topRightBtnAction={() => handleLocationAction(props, itemDetails)}
            >
              {renderLocationComponent(props, itemDetails, setCreatePickModalVisible)}
            </SFTCard>
            {renderSalesGraph(updatedSalesTS, toggleSalesGraphView, result,
              itemDetails, isSalesMetricsGraphView)}
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
  const createNewPickApi = useTypedSelector(state => state.async.createNewPick);
  const { userId } = useTypedSelector(state => state.User);
  const {
    exceptionType,
    actionCompleted,
    pendingOnHandsQty,
    floorLocations,
    reserveLocations
  } = useTypedSelector(state => state.ItemDetailScreen);
  const userFeatures = useTypedSelector(state => state.User.features);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();
  const [isSalesMetricsGraphView, setIsSalesMetricsGraphView] = useState(false);
  const [ohQtyModalVisible, setOhQtyModalVisible] = useState(false);
  const [createPickModalVisible, setCreatePickModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [numberOfPallets, setNumberOfPallets] = useState(1);
  const [isQuickPick, setIsQuickPick] = useState(false);
  return (
    <ReviewItemDetailsScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      isWaiting={isWaiting}
      error={error}
      result={result}
      addToPicklistStatus={addToPicklistStatus}
      completeItemApi={completeItemApi}
      createNewPickApi={createNewPickApi}
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
      createPickModalVisible={createPickModalVisible}
      setCreatePickModalVisible={setCreatePickModalVisible}
      errorModalVisible={errorModalVisible}
      setErrorModalVisible={setErrorModalVisible}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
      numberOfPallets={numberOfPallets}
      setNumberOfPallets={setNumberOfPallets}
      isQuickPick={isQuickPick}
      setIsQuickPick={setIsQuickPick}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
      userFeatures={userFeatures}
      userConfigs={userConfigs}
    />
  );
};
export default ReviewItemDetails;
