import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, BackHandler, Platform, RefreshControl, ScrollView, Text, TouchableOpacity,
  View
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
import { setItemDetails } from '../../state/actions/ReserveAdjustmentScreen';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  createNewPick,
  getItemDetailsV4,
  getItemManagerApprovalHistory,
  getItemPiHistory,
  getItemPiSalesHistory,
  getItemPicklistHistory,
  updateOHQty
} from '../../state/actions/saga';
import styles from './ReviewItemDetails.style';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import SFTCard from '../../components/sftcard/SFTCard';
import ItemDetails, {
  ItemHistoryI, OHChangeHistory, PickHistory
} from '../../models/ItemDetails';
import { CollapsibleCard } from '../../components/CollapsibleCard/CollapsibleCard';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import Button from '../../components/buttons/Button';
import SalesMetrics from '../../components/salesmetrics/SalesMetrics';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { resetScannedEvent, setManualScan, setScannedEvent } from '../../state/actions/Global';
import OHQtyUpdate from '../../components/ohqtyupdate/OHQtyUpdate';
import CreatePickDialog from '../../components/CreatePickDialog/CreatePickDialog';
import {
  resetLocations,
  setActionCompleted,
  setupScreen,
  updatePendingOHQty
} from '../../state/actions/ItemDetailScreen';
import { hideActivityModal, showActivityModal, showInfoModal } from '../../state/actions/Modal';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import Location from '../../models/Location';
import { AsyncState } from '../../models/AsyncState';
import {
  CREATE_NEW_PICK,
  GET_ITEM_DETAILS_V4,
  GET_ITEM_MANAGERAPPROVALHISTORY,
  GET_ITEM_PICKLISTHISTORY,
  GET_ITEM_PIHISTORY,
  GET_ITEM_PISALESHISTORY,
  UPDATE_OH_QTY
} from '../../state/actions/asyncAPI';
import { CustomModalComponent } from '../Modal/Modal';
import ItemDetailsList, { ItemDetailsListRow } from '../../components/ItemDetailsList/ItemDetailsList';
import { Configurations } from '../../models/User';
import { CreatePickRequest } from '../../services/Picking.service';
import { MOVE_TO_FRONT } from '../CreatePick/CreatePick';
import { approvalRequestSource } from '../../models/ApprovalListItem';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { setItemHistory } from '../../state/actions/ItemHistory';
import { setAuditItemNumber } from '../../state/actions/AuditWorklist';
import { TrackEventSource } from '../../models/Generics.d';
import { barcodeEmitter } from '../../utils/scannerUtils';

const GENERICS_ADD = 'GENERICS.ADD';
const GENERICS_ENTER_UPC = 'GENERICS.ENTER_UPC_ITEM_NBR';

const REVIEW_ITEM_DETAILS = 'Review_Item_Details';

export interface ItemDetailsScreenProps {
  scannedEvent: { value: string | null; type: string | null; };
  isManualScanEnabled: boolean;
  isWaiting: boolean; error: AxiosError | null; result: AxiosResponse | null;
  isPiHistWaiting: boolean; piHistError: AxiosError | null; piHistResult: AxiosResponse | null;
  isPiSalesHistWaiting: boolean; piSalesHistError: AxiosError | null; piSalesHistResult: AxiosResponse | null;
  managerApprovalHistoryApi: AsyncState;
  picklistHistoryApi: AsyncState;
  createNewPickApi: AsyncState;
  updateOHQtyApi: AsyncState;
  userId: string;
  exceptionType: string | null | undefined; actionCompleted: boolean; pendingOnHandsQty: number;
  floorLocations: Location[] | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  reserveLocations: Location[] | undefined;
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
  newOHQty: number; setNewOHQty: React.Dispatch<React.SetStateAction<number>>;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  useFocusEffectHook: (effect: EffectCallback) => void;
  userFeatures: string[];
  userConfigs: Configurations;
  countryCode: string;
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
  isManualScanEnabled: boolean;
  floorLocations?: Location[];
  reserveLocations?: Location[];
  userConfigs: Configurations;
}

export interface HistoryCardPropsI {
  date: string;
  qty: number;
}

const validateExceptionType = (exceptionType?: string) => exceptionType === 'NO'
  || exceptionType === 'C' || exceptionType === 'NSFL';

export const handleUpdateQty = (
  props: HandleProps,
  itemDetails: ItemDetails,
  scannedEvent: { value: string | null; type: string | null; },
  userConfigs: Configurations
) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, setOhQtyModalVisible, userId, dispatch
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall(REVIEW_ITEM_DETAILS, { action: 'update_OH_qty_click', itemNbr: itemDetails.itemNbr });
    if (userConfigs.auditWorklists) {
      if (scannedEvent.value) {
        dispatch(resetScannedEvent());
      }
      dispatch(setAuditItemNumber(itemDetails.itemNbr));
      navigation.navigate('AuditItem');
    } else {
      setOhQtyModalVisible(true);
    }
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

export const handleLocationAction = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, userId
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall(REVIEW_ITEM_DETAILS, { action: 'location_details_click', itemNbr: itemDetails.itemNbr });
    navigation.navigate('LocationDetails');
  }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
};

export const handleOHQtyClose = (
  onHandQty: number,
  dispatch: Dispatch<any>,
  setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>
) => {
  dispatch({ type: UPDATE_OH_QTY.RESET });
  setNewOHQty(onHandQty);
  setOhQtyModalVisible(false);
};

export const handleOHQtySubmit = (itemDetails: ItemDetails, newOHQty: number, dispatch: Dispatch<any>) => {
  const {
    basePrice, categoryNbr, itemName, itemNbr, onHandsQty, upcNbr
  } = itemDetails;
  const change = basePrice * (newOHQty - itemDetails.onHandsQty);
  dispatch(updateOHQty({
    data: {
      itemName,
      itemNbr,
      upcNbr: parseInt(upcNbr, 10),
      categoryNbr,
      oldQuantity: onHandsQty,
      newQuantity: newOHQty,
      dollarChange: change,
      initiatedTimestamp: moment().toISOString(),
      approvalRequestSource: approvalRequestSource.ItemDetails
    }
  }));
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
        visibilityTime: SNACKBAR_TIMEOUT,
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
      if (errResponse && errResponse.status === 409 && errResponse.data.errorEnum === 'NO_RESERVE_PALLETS_AVAILABLE') {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.NO_RESERVE_PALLET_AVAILABLE_ERROR'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else if (errResponse && errResponse.status === 409
        && errResponse.data.errorEnum === 'PICK_REQUEST_CRITERIA_ALREADY_MET') {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.PICK_REQUEST_CRITERIA_ALREADY_MET'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.CREATE_NEW_PICK_FAILURE'),
          text2: strings('GENERICS.TRY_AGAIN'),
          visibilityTime: SNACKBAR_TIMEOUT,
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

export const updateOHQtyApiHook = (
  updateOHQtyApi: AsyncState,
  dispatch: Dispatch<any>,
  isFocused: boolean,
  newOHQty: number,
  exceptionType: string,
  setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (isFocused) {
    if (!updateOHQtyApi.isWaiting && updateOHQtyApi.result) {
      dispatch(updatePendingOHQty(newOHQty));
      if (validateExceptionType(exceptionType)) {
        dispatch(setActionCompleted());
      }
      dispatch({ type: UPDATE_OH_QTY.RESET });
      setOhQtyModalVisible(false);
    }
  }
};

export const RenderItemHistoryCard = (
  props: HistoryCardPropsI
): JSX.Element => (
  <View style={styles.historyCard}>
    <Text>{moment(props.date).format('YYYY-MM-DD')}</Text>
    <Text>{props.qty}</Text>
  </View>
);

const NO_RESULTS_STATUS = 204;
const SUCCESS_STATUS = 200;

const onMorePickHistoryClick = (
  dispatch: Dispatch<any>,
  pickHistoryList: PickHistory[],
  navigation: NavigationProp<any>
) => {
  const data: ItemHistoryI[] = pickHistoryList.map(item => ({
    id: item.id,
    date: item.createTS,
    qty: item.itemQty
  }));
  const title = 'ITEM.PICK_HISTORY';
  dispatch(setItemHistory(data, title));
  navigation.navigate('ItemHistory');
};

const onMoreOHChangeHistoryClick = (
  dispatch: Dispatch<any>,
  onHandsHistory: OHChangeHistory[],
  navigation: NavigationProp<any>
) => {
  const historyData: ItemHistoryI[] = onHandsHistory.map(item => ({
    id: item.id,
    date: item.initiatedTimestamp,
    qty: item.newQuantity - item.oldQuantity
  }));
  dispatch(setItemHistory(historyData, 'ITEM.OH_CHANGE_HISTORY'));
  navigation.navigate('ItemHistory');
};

export const renderPickHistory = (
  props: HandleProps,
  pickHistoryList: PickHistory[],
  result: AxiosResponse | undefined,
  isWaiting: boolean,
  itemNbr: number
) => {
  const pickHistorySource: TrackEventSource = {
    screen: REVIEW_ITEM_DETAILS,
    action: 'pick_history_click',
    otherInfo: { itemNbr }
  };

  if (isWaiting) {
    return (
      <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource} isOpened>
        <View style={styles.bgWhite}>
          <ActivityIndicator
            animating={true}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.completeActivityIndicator}
          />
        </View>
      </CollapsibleCard>
    );
  }
  if (result && (result.status === SUCCESS_STATUS)) {
    if (result.data.code === SUCCESS_STATUS) {
      if (pickHistoryList && pickHistoryList.length) {
        const data = [...pickHistoryList].sort((a, b) => {
          const date1 = new Date(a.createTS);
          const date2 = new Date(b.createTS);
          return date2 > date1 ? 1 : -1;
        });
        return (
          <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource} isOpened>
            {data.slice(0, 5).map(item => (
              <RenderItemHistoryCard
                key={item.id}
                date={item.createTS}
                qty={item.itemQty}
              />
            ))}
            {pickHistoryList.length > 5 && (
              <View style={styles.moreBtnContainer}>
                <Button
                  type={3}
                  title={`${strings('LOCATION.MORE')}...`}
                  titleColor={COLOR.MAIN_THEME_COLOR}
                  titleFontSize={12}
                  titleFontWeight="bold"
                  height={28}
                  onPress={() => onMorePickHistoryClick(props.dispatch, data, props.navigation)}
                  style={styles.historyMoreBtn}
                />
              </View>
            )}
          </CollapsibleCard>
        );
      }
      return (
        <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource} isOpened>
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_PICK_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
    if (result.data.code === NO_RESULTS_STATUS) {
      return (
        <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource} isOpened>
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_PICK_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
  }
  return (
    <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource} isOpened>
      <View style={styles.activityIndicator}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_500} />
        <Text>{strings('ITEM.ERROR_PICK_HISTORY')}</Text>
      </View>
    </CollapsibleCard>
  );
};

const onPiSalesHistRetryClick = (
  trackEventCall: (eventName: string, params?: any) => void,
  itemNbr: number,
  dispatch: Dispatch<any>
) => {
  trackEventCall(REVIEW_ITEM_DETAILS, { action: 'api_sales_hist_retry_click', itemNbr });
  dispatch({ type: GET_ITEM_PISALESHISTORY.RESET });
  return dispatch(getItemPiSalesHistory(itemNbr));
};

const onPiHistRetryClick = (
  trackEventCall: (eventName: string, params?: any) => void,
  itemNbr: number,
  dispatch: Dispatch<any>
) => {
  trackEventCall(REVIEW_ITEM_DETAILS, { action: 'api_sales_hist_retry_click', itemNbr });
  dispatch({ type: GET_ITEM_PIHISTORY.RESET });
  return dispatch(getItemPiHistory(itemNbr));
};

export const renderPiHistoryOrPiSalesHistoryError = (
  isPiHist: boolean,
  error: AxiosError | null,
  trackEventCall: (eventName: string, params?: any) => void,
  itemNbr: number,
  dispatch: Dispatch<any>,
  message?: string
) => {
  if (error || message) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>
          {strings(isPiHist ? 'ITEM.ERROR_PI_DELIVERY_HISTORY' : 'ITEM.ERROR_PI_SALES_HISTORY')}
        </Text>
        <TouchableOpacity
          testID="piHistoryError"
          style={styles.errorButton}
          onPress={() => {
            if (isPiHist) {
              onPiHistRetryClick(trackEventCall, itemNbr, dispatch);
            } else {
              onPiSalesHistRetryClick(trackEventCall, itemNbr, dispatch);
            }
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View />
  );
};

export const renderReplenishmentHistory = (
  result: AxiosResponse | null,
  error: AxiosError | null,
  isWaiting: boolean,
  trackEventCall: (eventName: string, params?: any) => void,
  itemNbr: number,
  dispatch: Dispatch<any>
) => {
  if (isWaiting) {
    return (
      <View style={styles.bgWhite}>
        <ActivityIndicator
          animating={true}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.completeActivityIndicator}
        />
      </View>
    );
  }

  if (result?.status === SUCCESS_STATUS) {
    const deliveryHistory = result?.data;
    const replenishmentHistorySource: TrackEventSource = {
      screen: REVIEW_ITEM_DETAILS,
      action: 'replenishment_history_clicked',
      otherInfo: { itemNbr }
    };
    if (deliveryHistory?.deliveries && deliveryHistory.deliveries.length) {
      const data = [...deliveryHistory.deliveries].sort((a, b) => {
        const date1 = new Date(a.date);
        const date2 = new Date(b.date);
        return date2 > date1 ? 1 : -1;
      });
      return (
        <CollapsibleCard title={strings('ITEM.HISTORY')} source={replenishmentHistorySource}>
          {data.slice(0, 5).map((item, index) => {
            const key = `delivery-${index}`;
            return (
              <RenderItemHistoryCard
                key={key}
                date={item.date}
                qty={item.qty}
              />
            );
          })}
        </CollapsibleCard>
      );
    }
    return (
      <CollapsibleCard title={strings('ITEM.HISTORY')} source={replenishmentHistorySource}>
        <View style={styles.noDataContainer}>
          <Text>{strings('ITEM.NO_HISTORY')}</Text>
        </View>
      </CollapsibleCard>
    );
  }
  return renderPiHistoryOrPiSalesHistoryError(
    true,
    error,
    trackEventCall,
    itemNbr,
    dispatch,
    result?.data?.message
  );
};

export const renderOHChangeHistory = (
  props: HandleProps,
  mahResult: AxiosResponse<OHChangeHistory[]>,
  mahError: AxiosError | null,
  itemNbr: number,
  dispatch: Dispatch,
  trackEventCall: typeof trackEvent,
  openCardForTest = false
): JSX.Element => {
  const ohChangeHistory = (mahResult && mahResult.data) ? mahResult.data : [];
  const ohChangeHistorySource: TrackEventSource = {
    screen: REVIEW_ITEM_DETAILS,
    action: 'OH_change_history_click',
    otherInfo: { itemNbr }
  };
  if (mahResult) {
    if (mahResult.status === SUCCESS_STATUS) {
      if (ohChangeHistory && ohChangeHistory.length) {
        const data = [...ohChangeHistory].sort((a, b) => {
          const date1 = new Date(a.initiatedTimestamp);
          const date2 = new Date(b.initiatedTimestamp);
          return date2 > date1 ? 1 : -1;
        });
        return (
          <CollapsibleCard
            title={strings('ITEM.OH_CHANGE_HISTORY')}
            source={ohChangeHistorySource}
            isOpened={openCardForTest}
          >
            {data.slice(0, 5).map(item => (
              <RenderItemHistoryCard
                key={item.id}
                date={item.initiatedTimestamp}
                qty={item.newQuantity - item.oldQuantity}
              />
            ))}
            {ohChangeHistory.length > 5 && (
              <View style={styles.moreBtnContainer}>
                <Button
                  type={3}
                  title={`${strings('LOCATION.MORE')}...`}
                  titleColor={COLOR.MAIN_THEME_COLOR}
                  titleFontSize={12}
                  titleFontWeight="bold"
                  height={28}
                  onPress={() => onMoreOHChangeHistoryClick(props.dispatch, ohChangeHistory, props.navigation)}
                  style={styles.historyMoreBtn}
                />
              </View>
            )}
          </CollapsibleCard>
        );
      }
      return (
        <CollapsibleCard
          title={strings('ITEM.OH_CHANGE_HISTORY')}
          source={ohChangeHistorySource}
          isOpened={openCardForTest}
        >
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_OH_CHANGE_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
    if (mahResult.status === NO_RESULTS_STATUS) {
      return (
        <CollapsibleCard
          title={strings('ITEM.OH_CHANGE_HISTORY')}
          source={ohChangeHistorySource}
          isOpened={openCardForTest}
        >
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_OH_CHANGE_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
  }
  if (mahError) {
    return (
      <CollapsibleCard
        title={strings('ITEM.OH_CHANGE_HISTORY')}
        source={ohChangeHistorySource}
        isOpened={openCardForTest}
      >
        <View style={styles.activityIndicator}>
          <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_500} />
          <Text>{strings('ITEM.ERROR_OH_CHANGE_HISTORY')}</Text>
          <TouchableOpacity
            testID="managerApprovalHistoryError"
            style={styles.errorButton}
            onPress={() => {
              trackEventCall(REVIEW_ITEM_DETAILS, { action: 'api_manager_aprv_hist_retry_click', itemNbr });
              dispatch({ type: GET_ITEM_MANAGERAPPROVALHISTORY.RESET });
              dispatch(getItemManagerApprovalHistory(itemNbr));
            }}
          >
            <Text>{strings('GENERICS.RETRY')}</Text>
          </TouchableOpacity>
        </View>
      </CollapsibleCard>
    );
  }
  return <View />;
};

export const renderReserveLocQtys = (reserve?: Location[]) => {
  if (reserve && reserve.length) {
    return (
      <View>
        {reserve.map(item => (
          <View
            key={item.locationName}
            style={styles.reserveLoc}
          >
            <Text>{item.locationName}</Text>
            <Text>{item.qty}</Text>
          </View>
        ))}
      </View>
    );
  }
  return <View />;
};

export const renderAddPicklistButton = (
  props: (RenderProps & HandleProps),
  itemDetails: ItemDetails,
  setCreatePickModalVisible: React.Dispatch<React.SetStateAction<boolean>>
): JSX.Element => {
  // TODO use data from GetLocationsForItem endpoint https://jira.walmart.com/browse/INTLSAOPS-9251
  const { location } = itemDetails;
  const { userConfigs } = props;

  if (location && location.reserve && location.reserve.length >= 1) {
    return userConfigs.picking ? (
      <View style={styles.addToPicklistContainer}>
        <Button
          type={3}
          title={strings(GENERICS_ADD) + strings('ITEM.TO_PICKLIST')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          titleFontSize={12}
          titleFontWeight="bold"
          height={28}
          onPress={() => { setCreatePickModalVisible(true); }}
        />
      </View>
    ) : <View />;
  }

  return <View />;
};

export const renderReserveAdjustmentButton = (
  itemDetails: ItemDetails,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => (
  <View style={styles.reserveAdjustMentContainer}>
    <Button
      type={3}
      title={strings('ITEM.RESERVE_ADJUSTMENT')}
      titleColor={COLOR.MAIN_THEME_COLOR}
      titleFontSize={12}
      titleFontWeight="bold"
      height={28}
      onPress={() => {
        dispatch(resetScannedEvent());
        dispatch(setItemDetails(itemDetails));
        navigation.navigate('ReserveAdjustment');
      }}
    />
  </View>
);

export const renderLocationComponent = (
  props: (RenderProps & HandleProps),
  itemDetails: ItemDetails,
  setCreatePickModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>
): JSX.Element => {
  const {
    floorLocations, reserveLocations, userConfigs, navigation
  } = props;
  const { reserveAdjustment } = userConfigs;
  const hasFloorLocations = floorLocations && floorLocations.length >= 1;
  const hasReserveLocations = reserveLocations && reserveLocations.length >= 1;
  return (
    <View style={styles.locationContainer}>
      <View style={styles.locationDetailsContainer}>
        <Text>{strings('ITEM.FLOOR')}</Text>
        {hasFloorLocations && <Text>{floorLocations[0].locationName}</Text>}
      </View>
      <View style={styles.locationDetailsContainer}>
        <Text>{strings('ITEM.RESERVE')}</Text>
      </View>
      {renderReserveLocQtys(reserveLocations)}
      <View style={styles.renderPickListContainer}>
        {(reserveAdjustment && hasReserveLocations) && renderReserveAdjustmentButton(itemDetails, navigation, dispatch)}
        {renderAddPicklistButton(props, itemDetails, setCreatePickModalVisible)}
      </View>
    </View>
  );
};

export const renderReplenishmentCard = (
  itemDetails: ItemDetails,
  result: AxiosResponse | null,
  error: AxiosError | null,
  isWaiting: boolean,
  trackEventCall: (eventName: string, params?: any) => void,
  itemNbr: number,
  dispatch: Dispatch<any>
) => (
  <View>
    <View style={styles.replenishmentContainer}>
      <Text>{strings('ITEM.REPLENISHMENT')}</Text>
    </View>
    <View style={styles.replenishmentOrder}>
      <Text>{strings('ITEM.ON_ORDER')}</Text>
      <Text>{itemDetails.replenishment.onOrder}</Text>
    </View>
    {renderReplenishmentHistory(result, error, isWaiting, trackEventCall, itemNbr, dispatch)}
  </View>
);

export const renderSalesGraphV4 = (
  updatedSalesTS: string | undefined,
  toggleSalesGraphView: any,
  isSalesMetricsGraphView: boolean,
  result: AxiosResponse | null,
  error: AxiosError | null,
  isWaiting: boolean,
  trackEventCall: (eventName: string, params?: any) => void,
  itemNbr: number,
  dispatch: Dispatch<any>
): JSX.Element => (
  <SFTCard
    title={strings('ITEM.SALES_METRICS')}
    subTitle={updatedSalesTS}
    bottomRightBtnTxt={[strings('ITEM.TOGGLE_GRAPH')]}
    bottomRightBtnAction={isWaiting ? undefined : [toggleSalesGraphView]}
  >
    {isWaiting && (
      <ActivityIndicator
        animating={true}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.completeActivityIndicator}
      />
    )}
    {result?.status === SUCCESS_STATUS
      ? <SalesMetrics itemNbr={itemNbr} itemSalesHistory={result?.data} isGraphView={isSalesMetricsGraphView} />
      : renderPiHistoryOrPiSalesHistoryError(
        false,
        error,
        trackEventCall,
        itemNbr,
        dispatch,
        result?.data?.message
      )}
  </SFTCard>
);

const completeAction = () => {
  // TODO: reinstantiate when ios device support is needed
  // dispatch(actionCompletedAction());
  // dispatch(navigation.goBack());
};

export const renderScanForNoActionButton = (props: (RenderProps & HandleProps), itemNbr: number): JSX.Element => {
  const {
    actionCompleted, validateSessionCall, trackEventCall,
    userId, navigation, route
  } = props;

  if (actionCompleted) {
    return <View />;
  }

  if (Platform.OS === 'android') {
    return (
      <TouchableOpacity
        style={styles.scanForNoActionButton}
        onPress={() => {
          validateSessionCall(navigation, route.name).then(() => {
            trackEventCall(
              REVIEW_ITEM_DETAILS,
              { action: 'scan_for_no_action_click', itemNbr }
            );
            navigation.navigate('NoActionScan');
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

const renderAddLocationButton = (actionCompleted: boolean, onPress: () => void): JSX.Element => {
  if (actionCompleted) {
    return <View />;
  }

  return (
    <TouchableOpacity style={styles.scanForNoActionButton} onPress={onPress}>
      <MaterialCommunityIcon name="map-marker-plus" size={20} color={COLOR.WHITE} />
      <Text style={styles.buttonText}>{strings('MISSING_PALLET_WORKLIST.ADD_LOCATION')}</Text>
    </TouchableOpacity>
  );
};

// Renders scanned barcode error. TODO Temporary fix until Modal.tsx is refactored for more flexible usage
export const renderBarcodeErrorModal = (
  isVisible: boolean,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
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

export const callBackbarcodeEmitter = (props: ItemDetailsScreenProps, scan: any) => {
  const {
    userId,
    route,
    dispatch,
    navigation,
    setErrorModalVisible,
    trackEventCall,
    validateSessionCall
  } = props;
  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall(REVIEW_ITEM_DETAILS, { action: 'barcode_scan', value: scan.value, type: scan.type });
      if (!(scan.type.includes('QR Code') || scan.type.includes('QRCODE'))) {
        dispatch(setScannedEvent(scan));
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

export const onValidateBackPress = (props: ItemDetailsScreenProps, itemNbr: number) => {
  const {
    exceptionType, actionCompleted, dispatch, trackEventCall
  } = props;
  if (!actionCompleted) {
    if (exceptionType === 'po') {
      trackEventCall(REVIEW_ITEM_DETAILS, { action: 'back_press_action_incomplete', exceptionType, itemNbr });
      dispatch(showInfoModal(strings('ITEM.NO_SIGN_PRINTED'), strings('ITEM.NO_SIGN_PRINTED_DETAILS')));
      return true;
    }
    if (exceptionType === 'nsfl') {
      trackEventCall(REVIEW_ITEM_DETAILS, { action: 'back_press_action_incomplete', exceptionType, itemNbr });
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
        // TODO revert V2 changes once BE orchestration is pushed to production
        dispatch({ type: GET_ITEM_DETAILS_V4.RESET });
        dispatch({ type: GET_ITEM_PIHISTORY.RESET });
        dispatch({ type: GET_ITEM_PISALESHISTORY.RESET });
        dispatch({ type: GET_ITEM_PICKLISTHISTORY.RESET });
        dispatch({ type: GET_ITEM_MANAGERAPPROVALHISTORY.RESET });

        const itemNbr = parseInt(scannedEvent.value, 10);
        dispatch(getItemDetailsV4({ id: itemNbr }));
        dispatch(getItemPiHistory(itemNbr));
        dispatch(getItemPiSalesHistory(itemNbr));
        dispatch(getItemPicklistHistory(itemNbr));
        dispatch(getItemManagerApprovalHistory(itemNbr));
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

export const getLocationCount = (props: ItemDetailsScreenProps) => {
  const { floorLocations, reserveLocations } = props;
  return (floorLocations?.length ?? 0) + (reserveLocations?.length ?? 0);
};

export const getUpdatedSales = (itemDetails: ItemDetails) => (_.get(itemDetails, 'sales.lastUpdateTs')
  ? `${strings('GENERICS.UPDATED')} ${moment(itemDetails.sales?.lastUpdateTs).format('dddd, MMM DD hh:mm a')}`
  : undefined);

export const isError = (
  error: AxiosError | null,
  errorModalVisible: boolean,
  setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isManualScanEnabled: boolean,
  scannedEvent: { value: string | null; type: string | null; },
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  message?: string
) => {
  if (error || message) {
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
              trackEventCall(REVIEW_ITEM_DETAILS, { action: 'api_retry_click', barcode: scannedValue });
              return dispatch(getItemDetailsV4({ id: parseInt(scannedValue, 10) }));
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
    isPiHistWaiting, piHistError, piHistResult,
    isPiSalesHistWaiting, piSalesHistError, piSalesHistResult,
    managerApprovalHistoryApi,
    picklistHistoryApi,
    createNewPickApi,
    updateOHQtyApi,
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
    newOHQty, setNewOHQty,
    trackEventCall,
    validateSessionCall,
    useEffectHook,
    useFocusEffectHook,
    floorLocations, userFeatures, userConfigs,
    countryCode,
    exceptionType
  } = props;
  const { result: mahResult, error: mahError } = managerApprovalHistoryApi;

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

  const picklistHistory: PickHistory[] = (
    picklistHistoryApi.result && picklistHistoryApi.result.data.picklists
  ) ? picklistHistoryApi.result.data.picklists : [];

  const locationCount = getLocationCount(props);
  const updatedSalesTS = getUpdatedSales(itemDetails);

  // Set Item Details
  useEffectHook(() => {
    onValidateItemDetails(dispatch, itemDetails);
    setNewOHQty(itemDetails?.onHandsQty || 0);
  }, [itemDetails]);

  // Barcode event listener effect
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      callBackbarcodeEmitter(props, scan);
    });
    return () => {
      scanSubscription.remove();
    };
  }, [itemDetails, actionCompleted]);

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

  useFocusEffectHook(
    () => {
      const onBackPress = () => onValidateBackPress(props, itemDetails?.itemNbr || 0);

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  );

  useEffectHook(() => updateOHQtyApiHook(
    updateOHQtyApi,
    dispatch,
    navigation.isFocused(),
    newOHQty,
    itemDetails?.exceptionType || '',
    setOhQtyModalVisible
  ), [updateOHQtyApi]);

  // Get Item Details Error
  if (!isWaiting && (error || (itemDetails && itemDetails.message))) {
    const message = (itemDetails && itemDetails.message) ? itemDetails.message : undefined;
    return isError(
      error,
      errorModalVisible,
      setErrorModalVisible,
      isManualScanEnabled,
      scannedEvent,
      dispatch,
      trackEventCall,
      message // Checks for an error message from ItemDetails orchestration
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

  if (_.get(result, 'status') === 204 || _.get(itemDetails, 'code') === 204) {
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

  const toggleSalesGraphView = () => {
    trackEventCall(REVIEW_ITEM_DETAILS, {
      action: 'toggle_graph_click',
      itemNbr: itemDetails.itemNbr,
      isGraphView: !isSalesMetricsGraphView
    });
    setIsSalesMetricsGraphView((prevState: boolean) => !prevState);
  };

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall(REVIEW_ITEM_DETAILS, { action: 'refresh', itemNbr: itemDetails.itemNbr });
      dispatch({ type: GET_ITEM_DETAILS_V4.RESET });
      dispatch({ type: GET_ITEM_PIHISTORY.RESET });
      dispatch({ type: GET_ITEM_PISALESHISTORY.RESET });
      dispatch({ type: GET_ITEM_PICKLISTHISTORY.RESET });
      dispatch({ type: GET_ITEM_MANAGERAPPROVALHISTORY.RESET });
      dispatch(getItemDetailsV4({ id: itemDetails.itemNbr }));
      dispatch(getItemPiHistory(itemDetails.itemNbr));
      dispatch(getItemPiSalesHistory(itemDetails.itemNbr));
      dispatch(getItemPicklistHistory(itemDetails.itemNbr));
      dispatch(getItemManagerApprovalHistory(itemDetails.itemNbr));
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
          onHandsQty={itemDetails?.onHandsQty || 0}
          newOHQty={newOHQty}
          setNewOHQty={setNewOHQty}
          isWaiting={updateOHQtyApi.isWaiting}
          error={updateOHQtyApi.error}
          handleClose={() => handleOHQtyClose(
            itemDetails?.onHandsQty || 0,
            dispatch,
            setOhQtyModalVisible,
            setNewOHQty
          )}
          handleSubmit={() => handleOHQtySubmit(itemDetails, newOHQty, dispatch)}
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
              additionalItemDetails={{
                color: itemDetails.color,
                margin: itemDetails.margin,
                vendorPackQty: itemDetails.vendorPackQty,
                grossProfit: itemDetails.grossProfit,
                size: itemDetails.size,
                basePrice: itemDetails.basePrice,
                source: { screen: REVIEW_ITEM_DETAILS, action: 'additional_item_details_click' }
              }}
              countryCode={countryCode}
              showItemImage={userConfigs.showItemImage}
              worklistAuditType={itemDetails.worklistAuditType}
            />
            <SFTCard
              title={strings('ITEM.QUANTITY')}
              iconName="pallet"
              topRightBtnTxt={getPendingOnHandsQty(userFeatures, pendingOnHandsQty)
                ? strings('GENERICS.CHANGE') : undefined}
              topRightBtnAction={() => handleUpdateQty(props, itemDetails, scannedEvent, userConfigs)}
            >
              {renderOHQtyComponent({ ...itemDetails, pendingOnHandsQty })}
            </SFTCard>
            <View style={styles.historyContainer}>
              {renderOHChangeHistory(props, mahResult, mahError, itemDetails.itemNbr, dispatch, trackEventCall)}
            </View>
            <View style={styles.historyContainer}>
              {renderReplenishmentCard(
                itemDetails,
                piHistResult,
                piHistError,
                isPiHistWaiting,
                trackEventCall,
                itemDetails.itemNbr,
                dispatch
              )}
            </View>
            <SFTCard
              iconName="map-marker-alt"
              title={`${strings('ITEM.LOCATION')}(${locationCount})`}
              topRightBtnTxt={getTopRightBtnTxt(locationCount)}
              topRightBtnAction={() => handleLocationAction(props, itemDetails)}
            >
              {renderLocationComponent(props, itemDetails, setCreatePickModalVisible, dispatch)}
            </SFTCard>
            <View style={styles.historyContainer}>
              {renderPickHistory(
                props,
                picklistHistory,
                picklistHistoryApi.result,
                picklistHistoryApi.isWaiting,
                itemDetails.itemNbr
              )}
            </View>
            {(
              renderSalesGraphV4(
                updatedSalesTS,
                toggleSalesGraphView,
                isSalesMetricsGraphView,
                piSalesHistResult,
                piSalesHistError,
                isPiSalesHistWaiting,
                trackEventCall,
                itemDetails.itemNbr,
                dispatch
              ))}
          </View>
          )}
      </ScrollView>
      {exceptionType === 'NSFL' && (floorLocations && floorLocations.length === 0)
        ? renderAddLocationButton(actionCompleted, () => handleLocationAction(props, itemDetails))
        : renderScanForNoActionButton(props, itemDetails.itemNbr)}
    </View>
  );
};

const ReviewItemDetails = (): JSX.Element => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const createNewPickApi = useTypedSelector(state => state.async.createNewPick);
  const updateOHQtyApi = useTypedSelector(state => state.async.updateOHQty);
  const getItemDetailsV4Api = useTypedSelector(state => state.async.getItemDetailsV4);
  const getItemPiHistoryApi = useTypedSelector(state => state.async.getItemPiHistory);
  const getItemPiSalesHistoryApi = useTypedSelector(state => state.async.getItemPiSalesHistory);
  const getItemPicklistHistoryApi = useTypedSelector(state => state.async.getItemPicklistHistory);
  const getItemManagerApprovalHistoryApi = useTypedSelector(state => state.async.getItemManagerApprovalHistory);
  const { userId, countryCode } = useTypedSelector(state => state.User);
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
  const [newOHQty, setNewOHQty] = useState(0);

  const sortNames = (a: Location, b: Location) => a.locationName.localeCompare(b.locationName, undefined, {
    numeric: true
  });
  floorLocations.sort(sortNames);
  reserveLocations.sort(sortNames);

  return (
    <ReviewItemDetailsScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      isWaiting={getItemDetailsV4Api.isWaiting}
      error={getItemDetailsV4Api.error}
      result={getItemDetailsV4Api.result}
      isPiHistWaiting={getItemPiHistoryApi.isWaiting}
      piHistError={getItemPiHistoryApi.error}
      piHistResult={getItemPiHistoryApi.result}
      isPiSalesHistWaiting={getItemPiSalesHistoryApi.isWaiting}
      piSalesHistError={getItemPiSalesHistoryApi.error}
      piSalesHistResult={getItemPiSalesHistoryApi.result}
      managerApprovalHistoryApi={getItemManagerApprovalHistoryApi}
      picklistHistoryApi={getItemPicklistHistoryApi}
      createNewPickApi={createNewPickApi}
      updateOHQtyApi={updateOHQtyApi}
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
      newOHQty={newOHQty}
      setNewOHQty={setNewOHQty}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
      userFeatures={userFeatures}
      userConfigs={userConfigs}
      countryCode={countryCode}
    />
  );
};
export default ReviewItemDetails;
