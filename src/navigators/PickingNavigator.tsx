import React, {
  Dispatch, EffectCallback, useEffect, useState
} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Toast from 'react-native-toast-message';
import { trackEvent } from 'appcenter-analytics';
import {
  EmitterSubscription, Pressable, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, RouteProp, getFocusedRouteNameFromRoute, useNavigation, useRoute
} from '@react-navigation/native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import QuickPickTab from '../screens/QuickPickTab/QuickPickTab';
import { barcodeEmitter } from '../utils/scannerUtils';
import { validateSession } from '../utils/sessionTimeout';
import PickBinTab from '../screens/PickBinTab/PickBinTab';
import PickBinWorkflow from '../screens/PickBinWorkflow/PickBinWorkflowScreen';
import SalesFloorWorkflow from '../screens/SalesFloorWorkflow/SalesFloorWorkflow';
import CreatePick from '../screens/CreatePick/CreatePick';
import SalesFloorTab from '../screens/SalesFloorTab/SalesFloorTabScreen';
import { setManualScan } from '../state/actions/Global';
import styles from './PickingNavigator.style';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { PickListItem, PickStatus } from '../models/Picking.d';
import { UseStateType } from '../models/Generics.d';
import { AsyncState } from '../models/AsyncState';
import { getItemDetails } from '../state/actions/saga';
import { hideActivityModal, showActivityModal } from '../state/actions/Modal';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

// eslint-disable-next-line no-shadow
export enum Tabs {
  QUICKPICK,
  PICK,
  SALESFLOOR
}

interface PickingNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  picklist: PickListItem[];
  selectedTabState: UseStateType<Tabs>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getItemDetailsApi: AsyncState;
}

interface PickTabNavigator {
  picklist: PickListItem[];
  setSelectedTab: React.Dispatch<React.SetStateAction<Tabs>>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getItemDetailsApi: AsyncState;
  selectedTab: Tabs
}

export const getItemDetailsApiHook = (
  getItemDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  // on api success
  if (!getItemDetailsApi.isWaiting && getItemDetailsApi.result) {
    if (getItemDetailsApi.result.status === 200) {
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
};

export const PickTabNavigator = (props: PickTabNavigator): JSX.Element => {
  const {
    picklist, setSelectedTab, dispatch, navigation, route, useEffectHook, getItemDetailsApi, selectedTab
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
      if (navigation.isFocused() && (selectedTab === Tabs.PICK || selectedTab === Tabs.QUICKPICK)) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('Items_Details_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(getItemDetails({ id: scan.value, getSummary: false }));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Get Item Details UPC api
  useEffectHook(() => getItemDetailsApiHook(
    getItemDetailsApi,
    dispatch,
    navigation
  ), [getItemDetailsApi]);

  return (
    <Tab.Navigator initialRouteName="Pick">
      <Tab.Screen
        name="QuickPick"
        options={{
          title: `${strings('PICKING.QUICKPICK')} (${quickPickList.length})`
        }}
        listeners={{
          focus: () => setSelectedTab(Tabs.QUICKPICK)
        }}
      >
        {() => <QuickPickTab quickPickItems={quickPickList} />}
      </Tab.Screen>
      <Tab.Screen
        name="Pick"
        options={{
          title: `${strings('PICKING.PICK')} (${pickBinList.length})`
        }}
        listeners={{
          focus: () => setSelectedTab(Tabs.PICK)
        }}
      >
        {() => <PickBinTab pickBinList={pickBinList} />}
      </Tab.Screen>
      <Tab.Screen
        name="SalesFloor"
        options={{
          title: `${strings('ITEM.SALES_FLOOR_QTY')} (${salesFloorList.length})`
        }}
        listeners={{
          focus: () => setSelectedTab(Tabs.SALESFLOOR)
        }}
      >
        {() => <SalesFloorTab readyToWorklist={salesFloorList} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
    testID="manual-scan"
  >
    <View style={styles.leftButton}>
      <MaterialCommunityIcons
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const kebabMenuButton = () => (
  <Pressable onPress={() => {}} style={styles.leftButton}>
    <MaterialCommunityIcons
      name="dots-vertical"
      size={30}
      color={COLOR.WHITE}
    />
  </Pressable>
);

export const PickingNavigatorStack = (
  props: PickingNavigatorProps
): JSX.Element => {
  const {
    dispatch, isManualScanEnabled, picklist, selectedTabState, navigation, route, useEffectHook, getItemDetailsApi
  } = props;
  const [selectedTab, setSelectedTab] = selectedTabState;

  let createPickTitle = '';
  if (selectedTab === Tabs.PICK) {
    createPickTitle = strings('PICKING.CREATE_PICK');
  } else if (selectedTab === Tabs.QUICKPICK) {
    createPickTitle = strings('PICKING.CREATE_QUICK_PICK');
  }

  return (
    <Stack.Navigator
      headerMode="float"
      // eslint-disable-next-line no-shadow
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Pick';
        return {
          headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          headerTintColor: COLOR.WHITE,
          headerRight: () => (
            <View style={styles.headerContainer}>
              {routeName === 'QuickPick' || routeName === 'Pick'
                ? renderScanButton(dispatch, isManualScanEnabled)
                : null}
            </View>
          )
        };
      }}
    >
      <Stack.Screen
        name="PickingTabs"
        options={{
          headerTitle: strings('PICKING.PICKING')
        }}
      >
        {() => (
          <PickTabNavigator
            picklist={picklist}
            setSelectedTab={setSelectedTab}
            navigation={navigation}
            route={route}
            dispatch={dispatch}
            useEffectHook={useEffectHook}
            getItemDetailsApi={getItemDetailsApi}
            selectedTab={selectedTab}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="PickBinWorkflow"
        component={PickBinWorkflow}
        options={{
          headerTitle: strings('PICKING.PICKING'),
          headerRight: () => kebabMenuButton()
        }}
      />
      <Stack.Screen
        name="SalesFloorWorkflow"
        component={SalesFloorWorkflow}
        options={{
          headerTitle: strings('PICKING.PICKING'),
          headerRight: () => kebabMenuButton()
        }}
      />
      <Stack.Screen
        name="CreatePick"
        options={{
          headerTitle: createPickTitle,
          headerRight: () => null
        }}
        component={CreatePick}
      />
    </Stack.Navigator>
  );
};

const PickingNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const picklist = useTypedSelector(state => state.Picking.pickList);
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const selectedTabState = useState<Tabs>(Tabs.PICK);
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <PickingNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      selectedTabState={selectedTabState}
      picklist={picklist}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      getItemDetailsApi={getItemDetailsApi}
    />
  );
};

export default PickingNavigator;
