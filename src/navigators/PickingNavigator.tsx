/* eslint-disable react/no-unused-prop-types */
import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HeaderBackButton,
  HeaderBackButtonProps
} from '@react-navigation/elements';

import { Pressable, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
  ParamListBase,
  RouteProp,
  getFocusedRouteNameFromRoute
} from '@react-navigation/native';
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
  multiBinEnabled: boolean;
  multiPickEnabled: boolean;
  multiPick: boolean;
  multiBin: boolean;
}

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): React.JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
    testID="manual-scan"
  >
    <View style={{ ...styles.leftButton, ...styles.scanButton }}>
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
      trackEvent('multi_picking_menu_button_click');
    }}
    testID="picking-menu"
    style={({ pressed }) => [styles.leftButton, { opacity: pressed ? 0.5 : 1 }]}
  >
    <MaterialCommunityIcons
      name="dots-vertical"
      size={30}
      color={COLOR.WHITE}
    />
  </Pressable>
);

const pickingOptions = (
  navigate: (props: HeaderBackButtonProps) => void,
  props: PickingNavigatorProps
) => ({
  headerLeft: (hlProps: HeaderBackButtonProps) => (
    <HeaderBackButton
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...hlProps}
      onPress={() => {
        navigate(hlProps);
      }}
    />
  ),
  headerTitle: strings('PICKING.PICKING'),
  headerRight: () => kebabMenuButton(props.pickingMenu, props.dispatch)
});

const pickingTabsOptions = (
  screenRoute: RouteProp<ParamListBase, 'PickingTabs'>,
  props: PickingNavigatorProps
) => {
  const routeName = getFocusedRouteNameFromRoute(screenRoute) ?? props.selectedTab ?? 'Pick';
  return {
    headerRight: () => (
      <View style={styles.headerContainer}>
        {routeName === 'Pick'
        && (props.multiBin || props.multiPick)
        && !props.multiBinEnabled
        && !props.multiPickEnabled
          ? kebabMenuButton(props.pickingMenu, props.dispatch)
          : null}
        {!props.pickingMenu
        && (routeName === 'QuickPick' || routeName === 'Pick')
        && !props.multiBinEnabled
        && !props.multiPickEnabled
          ? renderScanButton(props.dispatch, props.isManualScanEnabled)
          : null}
      </View>
    ),
    headerTitle: strings('PICKING.PICKING')
  };
};

export const PickingNavigatorStack = (
  props: PickingNavigatorProps
): React.JSX.Element => {
  const {
    dispatch,
    selectedTab
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
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="PickingTabs"
        component={PickingTabs}
        options={({ route: screenRoute }) => pickingTabsOptions(screenRoute, props)}
      />
      <Stack.Screen
        name="PickBinWorkflow"
        component={PickBinWorkflow}
        options={() => pickingOptions(navigate, props)}
      />
      <Stack.Screen
        name="SalesFloorWorkflow"
        component={SalesFloorWorkflow}
        options={() => pickingOptions(navigate, props)}
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

const PickingNavigator = (): React.JSX.Element => {
  const {
    multiBinEnabled, multiPickEnabled, selectedTab, pickingMenu
  } = useTypedSelector(state => state.Picking);
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { multiBin, multiPick } = useTypedSelector(state => state.User.configs);
  return (
    <PickingNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      selectedTab={selectedTab}
      pickingMenu={pickingMenu}
      multiBinEnabled={multiBinEnabled}
      multiPickEnabled={multiPickEnabled}
      multiBin={multiBin}
      multiPick={multiPick}
    />
  );
};

export default PickingNavigator;
