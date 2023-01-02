import React, {
  DependencyList,
  EffectCallback,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  RefreshControl,
  ScrollView,
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
import { GET_ITEM_PALLETS } from '../../../state/actions/asyncAPI';
import { getItemPallets } from '../../../state/actions/saga';
import {
  setReserveLocations
} from '../../../state/actions/ReserveAdjustmentScreen';
import styles from './ReserveAdjustment.style';

export interface ReserveAdjustmentScreenProps {
    getItemDetailsApi: AsyncState;
    getItemPalletsApi: AsyncState;
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
  }

const getReserveLocationList = (locations: ItemPalletInfo[]) => {
  const locationLst: LocationList[] = [];
  if (locations && locations.length) {
    const sortedLocations = sortReserveLocations(locations);
    sortedLocations.forEach(loc => {
      locationLst.push({
        sectionId: loc.sectionId,
        locationName: loc.locationName,
        quantity: loc.newQty,
        scanned: loc.scanned,
        palletId: loc.palletId,
        locationType: 'reserve',
        increment: () => {},
        decrement: () => {},
        onDelete: () => {},
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
  if (navigation.isFocused()) {
    // on api success
    if (!getItemPalletsApi.isWaiting && getItemPalletsApi.result) {
      if (getItemPalletsApi.result.status === 200) {
        const { data } = getItemPalletsApi.result;
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
    getItemDetailsApi,
    getItemPalletsApi,
    itemDetails,
    reserveLocations,
    getItemPalletsError,
    setGetItemPalletsError, userId
  } = props;

  const handleReserveLocsRetry = () => {
    validateSessionCall(navigation, route.name).then(() => {
      if (itemDetails?.itemNbr) {
        dispatch({ type: GET_ITEM_PALLETS.RESET });
        dispatch(getItemPallets({ itemNbr: itemDetails.itemNbr }));
      }
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

  // Get Pallets api
  useEffectHook(
    () => getItemPalletsApiHook(getItemPalletsApi, dispatch, navigation, reserveLocations, setGetItemPalletsError),
    [getItemPalletsApi]
  );

  return (
    <View style={styles.container}>
      <View style={styles.marginBottomStyles}>
        <ItemCard
          itemNumber={itemDetails ? itemDetails.itemNbr : 0}
          description={itemDetails ? itemDetails.itemName : ''}
          onHandQty={itemDetails ? itemDetails.onHandsQty : 0}
          onClick={() => {
            trackEventCall('Reserve_Adjustment_Screen',
              { action: 'item_card_click', itemNumber: itemDetails?.itemNbr });
          }}
          loading={getItemDetailsApi.isWaiting}
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
          locationList={getReserveLocationList(reserveLocations)}
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
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const getItemPalletsApi = useTypedSelector(state => state.async.getItemPallets);
  const { itemDetails, reserveLocations } = useTypedSelector(state => state.ReserveAdjustmentScreen);
  const { countryCode, userId, configs: userConfig } = useTypedSelector(state => state.User);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [getItemPalletsError, setGetItemPalletsError] = useState(false);

  return (
    <ReserveAdjustmentScreen
      getItemDetailsApi={getItemDetailsApi}
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
    />
  );
};

export default ReserveAdjustment;
