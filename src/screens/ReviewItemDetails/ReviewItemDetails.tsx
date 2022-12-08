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
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  addToPicklist, createNewPick, getItemDetails, getItemDetailsV2, noAction, updateOHQty
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
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
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
  ADD_TO_PICKLIST, CREATE_NEW_PICK, GET_ITEM_DETAILS, GET_ITEM_DETAILS_V2, NO_ACTION, UPDATE_OH_QTY
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

export const COMPLETE_API_409_ERROR = 'Request failed with status code 409';
const ITEM_SCAN_DOESNT_MATCH = 'ITEM.SCAN_DOESNT_MATCH';
const ITEM_SCAN_DOESNT_MATCH_DETAILS = 'ITEM.SCAN_DOESNT_MATCH_DETAILS';

const GENERICS_ADD = 'GENERICS.ADD';
const GENERICS_ENTER_UPC = 'GENERICS.ENTER_UPC_ITEM_NBR';

const REVIEW_ITEM_DETAILS = 'Review_Item_Details';

export interface ItemDetailsScreenProps {
  scannedEvent: { value: string | null; type: string | null; };
  isManualScanEnabled: boolean;
  isWaiting: boolean; error: AxiosError | null; result: AxiosResponse | null;
  addToPicklistStatus: AsyncState;
  completeItemApi: AsyncState;
  createNewPickApi: AsyncState;
  updateOHQtyApi: AsyncState;
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
  newOHQty: number; setNewOHQty: React.Dispatch<React.SetStateAction<number>>;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  useFocusEffectHook: (effect: EffectCallback) => void;
  userFeatures: string[];
  userConfigs: Configurations;
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

export interface HistoryCardPropsI {
  date: string;
  qty: number;
}

const validateExceptionType = (exceptionType?: string) => exceptionType === 'NO'
  || exceptionType === 'C' || exceptionType === 'NSFL';

export const handleUpdateQty = (props: HandleProps, itemDetails: ItemDetails) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, setOhQtyModalVisible, userId
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall(REVIEW_ITEM_DETAILS, { action: 'update_OH_qty_click', itemNbr: itemDetails.itemNbr });
    setOhQtyModalVisible(true);
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

export const handleAddToPicklist = (props: HandleProps, itemNbr: number) => {
  const {
    navigation, trackEventCall, validateSessionCall, route, userId, dispatch
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    trackEventCall(REVIEW_ITEM_DETAILS, { action: 'add_to_picklist_click', itemNbr });
    dispatch(addToPicklist({
      itemNumber: itemNbr
    }));
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

const MULTI_STATUS = 207;
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
  result: AxiosResponse,
  itemNbr: number
) => {
  const pickHistorySource: TrackEventSource = {
    screen: REVIEW_ITEM_DETAILS,
    action: 'pick_history_click',
    otherInfo: { itemNbr }
  };
  if (result && (result.status === SUCCESS_STATUS || result.status === MULTI_STATUS)) {
    if (result.data.picklistHistory.code === SUCCESS_STATUS) {
      if (pickHistoryList && pickHistoryList.length) {
        const data = [...pickHistoryList].sort((a, b) => {
          const date1 = new Date(a.createTS);
          const date2 = new Date(b.createTS);
          return date2 > date1 ? 1 : -1;
        });
        return (
          <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource}>
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
        <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource}>
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_PICK_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
    if (result.data.picklistHistory.code === NO_RESULTS_STATUS) {
      return (
        <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource}>
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_PICK_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
  }
  return (
    <CollapsibleCard title={strings('ITEM.PICK_HISTORY')} source={pickHistorySource}>
      <View style={styles.activityIndicator}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_500} />
        <Text>{strings('ITEM.ERROR_PICK_HISTORY')}</Text>
      </View>
    </CollapsibleCard>
  );
};

export const renderReplenishmentHistory = (
  itemDetails: ItemDetails
) => {
  const { deliveryHistory } = itemDetails;
  const replenishmentHistorySource: TrackEventSource = {
    screen: REVIEW_ITEM_DETAILS,
    action: 'replenishment_history_clicked',
    otherInfo: { itemNbr: itemDetails.itemNbr }
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
};

export const renderReplenishmentCard = (
  itemDetails: ItemDetails
) => {
  const { replenishment } = itemDetails;
  return (
    <View>
      <View style={styles.replenishmentContainer}>
        <Text>{strings('ITEM.REPLENISHMENT')}</Text>
      </View>
      <View style={styles.replenishmentOrder}>
        <Text>{strings('ITEM.ON_ORDER')}</Text>
        <Text>{replenishment.onOrder}</Text>
      </View>
      {renderReplenishmentHistory(itemDetails)}
    </View>
  );
};

export const renderOHChangeHistory = (
  props: HandleProps,
  ohChangeHistory: OHChangeHistory[],
  result: AxiosResponse,
  itemNbr: number
) => {
  const ohChangeHistorySource: TrackEventSource = {
    screen: REVIEW_ITEM_DETAILS,
    action: 'OH_change_history_click',
    otherInfo: { itemNbr }
  };
  if (result && (result.status === SUCCESS_STATUS || result.status === MULTI_STATUS)) {
    if (result.data.itemOhChangeHistory.code === SUCCESS_STATUS) {
      if (ohChangeHistory && ohChangeHistory.length) {
        const data = [...ohChangeHistory].sort((a, b) => {
          const date1 = new Date(a.initiatedTimestamp);
          const date2 = new Date(b.initiatedTimestamp);
          return date2 > date1 ? 1 : -1;
        });
        return (
          <CollapsibleCard title={strings('ITEM.OH_CHANGE_HISTORY')} source={ohChangeHistorySource}>
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
        <CollapsibleCard title={strings('ITEM.OH_CHANGE_HISTORY')} source={ohChangeHistorySource}>
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_OH_CHANGE_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
    if (result.data.itemOhChangeHistory.code === NO_RESULTS_STATUS) {
      return (
        <CollapsibleCard title={strings('ITEM.OH_CHANGE_HISTORY')} source={ohChangeHistorySource}>
          <View style={styles.noDataContainer}>
            <Text testID="msg-no-pick-data">{strings('ITEM.NO_OH_CHANGE_HISTORY')}</Text>
          </View>
        </CollapsibleCard>
      );
    }
  }
  return (
    <CollapsibleCard title={strings('ITEM.OH_CHANGE_HISTORY')} source={ohChangeHistorySource}>
      <View style={styles.activityIndicator}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_500} />
        <Text>{strings('ITEM.ERROR_OH_CHANGE_HISTORY')}</Text>
      </View>
    </CollapsibleCard>
  );
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
  return <></>;
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
          onPress={() => handleAddToPicklist(props, itemDetails.itemNbr)}
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
          userConfigs.picking ? setCreatePickModalVisible(true) : handleAddToPicklist(props, itemDetails.itemNbr);
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
  const { floorLocations, reserveLocations, userConfigs } = props;
  const { additionalItemDetails } = userConfigs;
  return (
    <View style={styles.locationContainer}>
      <View style={styles.locationDetailsContainer}>
        <Text>{strings('ITEM.FLOOR')}</Text>
        {floorLocations && floorLocations.length >= 1
          && <Text>{floorLocations[0].locationName}</Text>}
      </View>
      <View style={styles.locationDetailsContainer}>
        <Text>{strings('ITEM.RESERVE')}</Text>
        {reserveLocations && reserveLocations.length >= 1
          && !additionalItemDetails && <Text>{reserveLocations[0].locationName}</Text> }
      </View>
      {additionalItemDetails && renderReserveLocQtys(reserveLocations)}
      <View style={styles.renderPickListContainer}>
        {renderAddPicklistButton(props, itemDetails, setCreatePickModalVisible)}
      </View>
    </View>
  );
};

export const renderSalesGraph = (updatedSalesTS: string | undefined, toggleSalesGraphView: any,
  result: AxiosResponse | null, itemDetails: ItemDetails, isSalesMetricsGraphView: boolean): JSX.Element => {
  // Checks orchestration response status for itemDetails only.

  if ((itemDetails.code !== undefined && itemDetails.code !== MULTI_STATUS) || itemDetails.sales.error === undefined) {
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
  if ((result && result.status !== MULTI_STATUS) || itemDetails.sales.error === undefined) {
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
  props: (RenderProps & HandleProps), itemNbr: number
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
            trackEventCall(REVIEW_ITEM_DETAILS,
              { action: 'scan_for_no_action_click', itemNbr });
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
      trackEventCall(REVIEW_ITEM_DETAILS, { action: 'barcode_scan', value: scan.value, type: scan.type });
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
    validateSessionCall, userConfigs
  } = props;

  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name).then(() => {
      if (scannedEvent.value) {
        // TODO revert V2 changes once BE orchestration is pushed to production
        if (userConfigs.additionalItemDetails) {
          dispatch({ type: GET_ITEM_DETAILS_V2.RESET });
          dispatch(
            getItemDetailsV2(
              {
                id: parseInt(scannedEvent.value, 10),
                getMetadataHistory: userConfigs.additionalItemDetails
              }
            )
          );
        } else {
          dispatch({ type: GET_ITEM_DETAILS.RESET });
          dispatch(getItemDetails({ id: parseInt(scannedEvent.value, 10) }));
        }
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
  trackEventCall: (eventName: string, params?: any) => void,
  additionalItemDetails: boolean,
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
              return additionalItemDetails ? dispatch(getItemDetailsV2({ id: parseInt(scannedValue, 10) }))
                : dispatch(getItemDetails({ id: parseInt(scannedValue, 10) }));
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
    floorLocations, userFeatures, userConfigs
  } = props;

  const { additionalItemDetails } = userConfigs;
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

  const itemDetails: ItemDetails = additionalItemDetails
    ? (result && result.data.itemDetails)
    : (result && result.data); // || getMockItemDetails(scannedEvent.value);

  const itemOhChangeHistory = (result && result.data.itemOhChangeHistory)
    ? result.data.itemOhChangeHistory.ohChangeHistory : [];
  const picklistHistory = (result && result.data.picklistHistory) ? result.data.picklistHistory.picklists : [];

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
      const onBackPress = () => onValidateBackPress(props, itemDetails.itemNbr);

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
      additionalItemDetails,
      message // Checks for an error message from ItemDetails orchestration
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
    trackEventCall(REVIEW_ITEM_DETAILS, {
      action: 'toggle_graph_click',
      itemNbr: itemDetails.itemNbr,
      isGraphView: !isSalesMetricsGraphView
    });
    setIsSalesMetricsGraphView((prevState: boolean) => !prevState);
  };

  const navigateToAuditItemScreen = () => {
    dispatch(setAuditItemNumber(itemDetails.itemNbr));
    navigation.navigate('AuditItem');
  };

  const handleRefresh = () => {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall(REVIEW_ITEM_DETAILS, { action: 'refresh', itemNumber: itemDetails.itemNbr });
      if (additionalItemDetails) {
        dispatch({ type: GET_ITEM_DETAILS_V2.RESET });
        dispatch(getItemDetailsV2({ id: itemDetails.itemNbr }));
      } else {
        dispatch({ type: GET_ITEM_DETAILS.RESET });
        dispatch(getItemDetails({ id: itemDetails.itemNbr }));
      }
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
          handleClose={() => handleOHQtyClose(itemDetails?.onHandsQty || 0,
            dispatch,
            setOhQtyModalVisible,
            setNewOHQty)}
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
            {userConfigs.showOpenAuditLink
            && (
            <View style={styles.openAuditContainer}>
              <TouchableOpacity onPress={navigateToAuditItemScreen}>
                <Text style={styles.openAuditText}>{strings('AUDITS.OPEN_AUDIT_LABEL')}</Text>
              </TouchableOpacity>
            </View>
            )}
            <ItemInfo
              itemName={itemDetails.itemName}
              itemNbr={itemDetails.itemNbr}
              upcNbr={itemDetails.upcNbr}
              status={itemDetails.status || ''}
              category={`${itemDetails.categoryNbr} - ${itemDetails.categoryDesc}`}
              price={itemDetails.price}
              exceptionType={getExceptionType(actionCompleted, itemDetails)}
              navigationForPrint={navigation}
              showAdditionalItemDetails={additionalItemDetails}
              additionalItemDetails={{
                color: itemDetails.color,
                margin: itemDetails.margin,
                vendorPackQty: itemDetails.vendorPackQty,
                grossProfit: itemDetails.grossProfit,
                size: itemDetails.size,
                basePrice: itemDetails.basePrice,
                source: { screen: REVIEW_ITEM_DETAILS, action: 'additional_item_details_click' }
              }}
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
            {additionalItemDetails && (
              <>
                <View style={styles.historyContainer}>
                  {renderOHChangeHistory(props, itemOhChangeHistory, result, itemDetails.itemNbr)}
                </View>
                <View style={styles.historyContainer}>
                  {renderReplenishmentCard(itemDetails)}
                </View>
              </>
            )}
            {!additionalItemDetails && (
            <SFTCard
              title={strings('ITEM.REPLENISHMENT')}
            >
              <View style={styles.itemOnOrderView}>
                <Text>{strings('ITEM.ON_ORDER')}</Text>
                <Text>{itemDetails.replenishment.onOrder}</Text>
              </View>
            </SFTCard>
            )}
            <SFTCard
              iconName="map-marker-alt"
              title={`${strings('ITEM.LOCATION')}(${locationCount})`}
              topRightBtnTxt={getTopRightBtnTxt(locationCount)}
              topRightBtnAction={() => handleLocationAction(props, itemDetails)}
            >
              {renderLocationComponent(props, itemDetails, setCreatePickModalVisible)}
            </SFTCard>
            {additionalItemDetails && (
              <View style={styles.historyContainer}>
                {renderPickHistory(props, picklistHistory, result, itemDetails.itemNbr)}
              </View>
            )}
            {renderSalesGraph(updatedSalesTS, toggleSalesGraphView, result,
              itemDetails, isSalesMetricsGraphView)}
          </View>
          )}
      </ScrollView>
      {renderScanForNoActionButton(props, itemDetails.itemNbr)}
    </View>
  );
};

const ReviewItemDetails = (): JSX.Element => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails);
  const addToPicklistStatus = useTypedSelector(state => state.async.addToPicklist);
  const completeItemApi = useTypedSelector(state => state.async.noAction);
  const createNewPickApi = useTypedSelector(state => state.async.createNewPick);
  const updateOHQtyApi = useTypedSelector(state => state.async.updateOHQty);
  const getItemDetailsV2Api = useTypedSelector(state => state.async.getItemDetailsV2);
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
  const [newOHQty, setNewOHQty] = useState(0);

  return (
    <ReviewItemDetailsScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      isWaiting={userConfigs.additionalItemDetails ? getItemDetailsV2Api.isWaiting : isWaiting}
      error={userConfigs.additionalItemDetails ? getItemDetailsV2Api.error : error}
      result={userConfigs.additionalItemDetails ? getItemDetailsV2Api.result : result}
      addToPicklistStatus={addToPicklistStatus}
      completeItemApi={completeItemApi}
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
    />
  );
};
export default ReviewItemDetails;
