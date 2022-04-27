import React, {
  DependencyList, Dispatch, EffectCallback, useCallback, useEffect
} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Toast from 'react-native-toast-message';
import { trackEvent } from 'appcenter-analytics';
import { EmitterSubscription } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { strings } from '../../locales';
import QuickPickTab from '../../screens/QuickPickTab/QuickPickTab';
import { barcodeEmitter } from '../../utils/scannerUtils';
import PickBinTab from '../../screens/PickBinTab/PickBinTab';
import CreatePick from '../../screens/CreatePick/CreatePick';
import SalesFloorTab from '../../screens/SalesFloorTab/SalesFloorTabScreen';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickListItem, PickStatus, Tabs } from '../../models/Picking.d';
import { validateSession } from '../../utils/sessionTimeout';
import { getItemDetails, getPicklists } from '../../state/actions/saga';
import {
  initializePicklist,
  setPickCreateItem,
  setPickCreateFloor,
  setPickCreateReserve,
  setSelectedTab
} from '../../state/actions/Picking';
import { resetScannedEvent } from '../../state/actions/Global';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

const Tab = createMaterialTopTabNavigator();

interface PickingTabNavigatorProps {
  picklist: PickListItem[];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getItemDetailsApi: AsyncState;
  getPicklistsApi: AsyncState;
  selectedTab: Tabs;
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
}

export const getItemDetailsApiHook = (
  getItemDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.result) {
      if (getItemDetailsApi.result.status === 200) {
        dispatch(setPickCreateItem({
          itemName: getItemDetailsApi.result.data.itemName,
          itemNbr: getItemDetailsApi.result.data.itemNbr,
          upcNbr: getItemDetailsApi.result.data.upcNbr,
          categoryNbr: getItemDetailsApi.result.data.categoryNbr,
          categoryDesc: getItemDetailsApi.result.data.categoryDesc,
          price: getItemDetailsApi.result.data.price
        }));
        dispatch(setPickCreateFloor(getItemDetailsApi.result.data.location.floor || []));
        dispatch(setPickCreateReserve(getItemDetailsApi.result.data.location.reserve || []));
        navigation.navigate('CreatePick');
      } else if (getItemDetailsApi.result.status === 204) {
        Toast.show({
          type: 'error',
          text1: strings('ITEM.ITEM_NOT_FOUND'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
      dispatch(hideActivityModal());
    }
    // on api error
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.error) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'error',
        text1: strings('ITEM.API_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // on api request
    if (getItemDetailsApi.isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const getPicklistApiHook = (
  getPicklistApi: AsyncState,
  dispatch: Dispatch<any>,
  isFocused: boolean
): void => {
  if (isFocused && !getPicklistApi.isWaiting) {
    // Get Picklist api success
    if (getPicklistApi.result) {
      if (getPicklistApi.result.status === 200) {
        dispatch(initializePicklist(getPicklistApi.result.data));
        Toast.show({
          type: 'success',
          text1: strings('PICKING.PICKLIST_SUCCESS'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      } else if (getPicklistApi.result.status === 204) {
        Toast.show({
          type: 'info',
          text1: strings('PICKING.PICKLIST_NOT_FOUND'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
      dispatch(hideActivityModal());
    }
    // Get Picklist api error
    if (getPicklistApi.error) {
      Toast.show({
        type: 'error',
        text1: strings('PICKING.PICKLIST_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      dispatch(hideActivityModal());
    }
  }
  // Get Picklist api isWaiting
  if (isFocused && getPicklistApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const PickingTabNavigator = (props: PickingTabNavigatorProps): JSX.Element => {
  const {
    picklist,
    dispatch,
    navigation,
    route,
    useEffectHook,
    getItemDetailsApi,
    getPicklistsApi,
    selectedTab,
    useCallbackHook,
    useFocusEffectHook
  } = props;

  let scannedSubscription: EmitterSubscription;

  const quickPickList = picklist.filter(item => item.quickPick);
  const pickBinList = picklist.filter(
    item => !item.quickPick
      && (item.status === PickStatus.ACCEPTED_BIN
        || item.status === PickStatus.ACCEPTED_PICK
        || item.status === PickStatus.READY_TO_BIN
        || item.status === PickStatus.READY_TO_PICK)
  );
  const salesFloorList = picklist.filter(
    item => !item.quickPick && item.status === PickStatus.READY_TO_WORK
  );

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (
        navigation.isFocused()
        && (selectedTab === Tabs.PICK || selectedTab === Tabs.QUICKPICK)
        && scan.value
      ) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('Items_Details_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(getItemDetails({ id: scan.value, getSummary: false }));
          dispatch(resetScannedEvent());
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSession(navigation, route.name).then(() => {
        dispatch(getPicklists());
      });
    }, [navigation])
  );

  // Get Item Details UPC api
  useEffectHook(
    () => getItemDetailsApiHook(getItemDetailsApi, dispatch, navigation),
    [getItemDetailsApi]
  );

  // Get Picklist Api Hook
  useEffect(
    () => getPicklistApiHook(getPicklistsApi, dispatch, navigation.isFocused()),
    [getPicklistsApi]
  );

  return (
    <Tab.Navigator initialRouteName={selectedTab}>
      <Tab.Screen
        name={Tabs.QUICKPICK}
        options={{
          title: `${strings('PICKING.QUICKPICK')} (${quickPickList.length})`
        }}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.QUICKPICK))
        }}
      >
        {() => <QuickPickTab quickPickItems={quickPickList} />}
      </Tab.Screen>
      <Tab.Screen
        name={Tabs.PICK}
        options={{
          title: `${strings('PICKING.PICK')} (${pickBinList.length})`
        }}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.PICK))
        }}
      >
        {() => <PickBinTab pickBinList={pickBinList} />}
      </Tab.Screen>
      <Tab.Screen
        name={Tabs.SALESFLOOR}
        options={{
          title: `${strings('ITEM.SALES_FLOOR_QTY')} (${salesFloorList.length})`
        }}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.SALESFLOOR))
        }}
      >
        {() => <SalesFloorTab readyToWorklist={salesFloorList} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const PickingTabs = (): JSX.Element => {
  const dispatch = useDispatch();
  const picklist = useTypedSelector(state => state.Picking.pickList);
  const getPicklistApi = useTypedSelector(state => state.async.getPicklists);
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const selectedTab = useTypedSelector(state => state.Picking.selectedTab);
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <PickingTabNavigator
      picklist={picklist}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      getItemDetailsApi={getItemDetailsApi}
      getPicklistsApi={getPicklistApi}
      selectedTab={selectedTab}
      useCallbackHook={useCallback}
      useFocusEffectHook={useFocusEffect}
    />
  )
};

export default PickingTabs;
