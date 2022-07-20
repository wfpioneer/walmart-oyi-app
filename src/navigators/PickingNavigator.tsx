import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HeaderBackButton,
  HeaderBackButtonProps
} from '@react-navigation/elements';

import { Pressable, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import PickingTabs from './PickingTabs/PickingTabNavigator';
import PickBinWorkflow from '../screens/PickBinWorkflow/PickBinWorkflowScreen';
import SalesFloorWorkflow from '../screens/SalesFloorWorkflow/SalesFloorWorkflow';
import CreatePick from '../screens/CreatePick/CreatePick';
import SelectLocationType from '../screens/SelectLocationType/SelectLocationType';
import { setManualScan } from '../state/actions/Global';
import styles from './PickingNavigator.style';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { Tabs } from '../models/Picking.d';
import { showPickingMenu } from '../state/actions/Picking';
import { trackEvent } from '../utils/AppCenterTool';

const Stack = createStackNavigator();

interface PickingNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  selectedTab: Tabs;
  pickingMenu: boolean;
}

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

export const kebabMenuButton = (
  pickingMenu: boolean,
  dispatch: Dispatch<any>
) => (
  <Pressable
    onPress={() => {
      dispatch(showPickingMenu(!pickingMenu));
      trackEvent('picking_menu_button_click');
    }}
    style={styles.leftButton}
  >
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
    dispatch, isManualScanEnabled, selectedTab, pickingMenu
  } = props;

  const navigate = (hlProps: HeaderBackButtonProps) => {
    dispatch(showPickingMenu(false));
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    hlProps.canGoBack && hlProps.onPress && hlProps.onPress();
  };

  let createPickTitle = '';
  if (selectedTab === Tabs.PICK) {
    createPickTitle = strings('PICKING.CREATE_PICK');
  } else if (selectedTab === Tabs.QUICKPICK) {
    createPickTitle = strings('PICKING.CREATE_QUICK_PICK');
  }

  return (
    <Stack.Navigator
      screenOptions={({ route: screenRoute }) => {
        const routeName = getFocusedRouteNameFromRoute(screenRoute) ?? 'Pick';
        return {
          headerMode: 'float',
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
        component={PickingTabs}
        options={{
          headerTitle: strings('PICKING.PICKING')
        }}
      />
      <Stack.Screen
        name="PickBinWorkflow"
        component={PickBinWorkflow}
        options={{
          headerTitle: strings('PICKING.PICKING'),
          headerRight: () => kebabMenuButton(pickingMenu, dispatch),
          headerLeft: hlProps => (
            <HeaderBackButton
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...hlProps}
              onPress={() => {
                navigate(hlProps);
              }}
            />
          )
        }}
      />
      <Stack.Screen
        name="SalesFloorWorkflow"
        component={SalesFloorWorkflow}
        options={{
          headerTitle: strings('PICKING.PICKING'),
          headerRight: () => kebabMenuButton(pickingMenu, dispatch),
          headerLeft: hlProps => (
            <HeaderBackButton
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...hlProps}
              onPress={() => {
                navigate(hlProps);
              }}
            />
          )
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
      <Stack.Screen
        name="AddLocation"
        component={SelectLocationType}
        options={{
          headerTitle: strings('LOCATION.ADD_NEW_LOCATION'),
          headerTitleAlign: 'left',
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
};

const PickingNavigator = (): JSX.Element => {
  const { selectedTab, pickingMenu } = useTypedSelector(state => state.Picking);
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  return (
    <PickingNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      selectedTab={selectedTab}
      pickingMenu={pickingMenu}
    />
  );
};

export default PickingNavigator;
