import React, {
  EffectCallback, RefObject, createRef, useEffect, useState
} from 'react';
import {
  ActivityIndicator, BackHandler, Platform, RefreshControl, ScrollView, Text, TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import _ from 'lodash';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AxiosError, AxiosResponse } from 'axios';
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

export interface AuditItemScreenProps {
    scannedEvent: { value: string | null; type: string | null; };
    isManualScanEnabled: boolean;
    isWaitingItemDetailsRes: boolean; itemDetailsResErrror: AxiosError | null; itemDetailsRes: AxiosResponse | null;
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

export const AuditItemScreen = (props: AuditItemScreenProps): JSX.Element => {
  const {
    scannedEvent, isManualScanEnabled,
    isWaitingItemDetailsRes, itemDetailsResErrror, itemDetailsRes,
    userId,
    route,
    dispatch,
    navigation,
    scrollViewRef,
    trackEventCall,
    validateSessionCall,
    useEffectHook,
    useFocusEffectHook,
    userFeatures, userConfigs,
    itemNumber
  } = props;

  useEffectHook(() => {
    if (navigation.isFocused()) {
      dispatch({ type: GET_ITEM_DETAILS.RESET });
      dispatch(getItemDetails({ id: itemNumber }));
    }
  }, []);

  // Scanned Item Event Listener
  useEffectHook(() => {
    // TO DO
  }, [scannedEvent]);

  const itemDetails: ItemDetails = (itemDetailsRes && itemDetailsRes.data);

  // Set Item Details
  useEffectHook(() => {
    // TO DO
  }, [itemDetails]);

  if (!isWaitingItemDetailsRes && (itemDetailsResErrror || (itemDetails && itemDetails.message))) {
    const message = (itemDetails && itemDetails.message) ? itemDetails.message : undefined;
    return isError(
      itemDetailsResErrror,
      dispatch,
      trackEventCall,
      itemNumber,
      message
    );
  }

  if (_.get(itemDetailsRes, 'status') === 204 || _.get(itemDetails, 'code') === 204) {
    return (
      <View style={styles.safeAreaView}>
        {/* { TODO } */}
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

  const emptyData = {
    itemNbr: 0,
    itemName: '',
    onHandsQty: 0,
    location: {
      floor: null,
      reserver: null
    }
  };

  const itemDetailsData = (itemDetails || emptyData);
  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}
      refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
    >
      {isManualScanEnabled && <ManualScanComponent placeholder={strings('LOCATION.PALLET')} />}
      <View
        style={styles.container}
      >
        <View style={{ marginBottom: 8 }}>
          <ItemCard
            itemNumber={itemDetailsData.itemNbr}
            description={itemDetailsData.itemName}
            imageUrl={undefined}
            onHandQty={itemDetailsData.onHandsQty}
            onClick={() => { }}
            loading={isWaitingItemDetailsRes}
          />
        </View>
        <View style={styles.marginBottomStyle}>
          <LocationListCard
            locationList={getLocationList(itemDetailsData.location.floor)}
            locationType="floor"
            loading={isWaitingItemDetailsRes}
            error={!!itemDetailsResErrror}
            onRetry={() => { }}
            scanRequired={false}
          />
        </View>
        <View style={styles.marginBottomStyle}>
          <LocationListCard
            locationList={getLocationList(itemDetailsData.location.reserve)}
            locationType="reserve"
            loading={isWaitingItemDetailsRes}
            error={!!itemDetailsResErrror}
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
            loading={isWaitingItemDetailsRes}
            collapsed={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const AuditItem = (): JSX.Element => {
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { isWaiting, error, result } = useTypedSelector(state => state.async.getItemDetails);
  const { userId } = useTypedSelector(state => state.User);
  const userFeatures = useTypedSelector(state => state.User.features);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: RefObject<ScrollView> = createRef();

  // TODO replaced from redux state when navigating from audit worklist
  const itemNbr = 980056535;

  return (
    <AuditItemScreen
      scannedEvent={scannedEvent}
      isManualScanEnabled={isManualScanEnabled}
      isWaitingItemDetailsRes={isWaiting}
      itemDetailsResErrror={error}
      itemDetailsRes={result}
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
      itemNumber={itemNbr}
    />
  );
};

export default AuditItem;
