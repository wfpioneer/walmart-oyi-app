import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
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
import { setFloorLocations, setItemDetails, setReserveLocations } from '../../../state/actions/AuditItemScreen';

export interface AuditItemScreenProps {
    scannedEvent: { value: string | null; type: string | null; };
    isManualScanEnabled: boolean;
    getItemDetailsApi: AsyncState;
    getLocationApi: AsyncState;
    userId: string;
    floorLocations?: Location[];
    reserveLocations?: Location[];
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
  if (locDetails.location) {
    if (locDetails.location.floor) {
      dispatch(setFloorLocations(locDetails.location.floor));
    }
    if (locDetails.location.reserve) {
      dispatch(setReserveLocations(locDetails.location.reserve));
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
        dispatch(setReserveLocations(itemDetails.location.reserve || []));
        setShowItemNotFoundMsg(false);
      } else if (getItemDetailsApi.result.status === 204) {
        setShowItemNotFoundMsg(true);
        Toast.show({
          type: 'error',
          text1: strings('ITEM.ITEM_NOT_FOUND'),
          visibilityTime: 4000,
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
    reserveLocations
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
  useEffectHook(() => {
    if (!getLocationApi.isWaiting && getLocationApi.result) {
      getlocationsApiResult(getLocationApi, dispatch);
    }
  }, [getLocationApi]);

  // Get Item Details UPC api
  useEffectHook(
    () => getItemDetailsApiHook(getItemDetailsApi, dispatch, navigation, setShowItemNotFoundMsg),
    [getItemDetailsApi]
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

  const getLocationList = (locations: Location[] | undefined) => {
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

  return (
    <>
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
              locationList={getLocationList(floorLocations)}
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
              locationList={getLocationList(reserveLocations)}
              locationType="reserve"
              loading={getItemDetailsApi.isWaiting || getLocationApi.isWaiting}
              error={!!(getItemDetailsApi.error || getLocationApi.error)}
              onRetry={() => { }}
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

  return (
    <AuditItemScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      getItemDetailsApi={getItemDetailsApi}
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
    />
  );
};

export default AuditItem;
