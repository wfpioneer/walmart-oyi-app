import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
  getFocusedRouteNameFromRoute,
  useRoute
} from '@react-navigation/native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import Picking from '../screens/Picking/Picking';
import PickBinTab from '../screens/PickBinTab/PickBinTabScreen';
import QuickPickTab from '../screens/QuickPickTab/QuickPickTabScreen';
import SalesFloorTab from '../screens/SalesFloorTab/SalesFloorTabScreen';
import { setManualScan } from '../state/actions/Global';
import styles from './PickingNavigator.style';
import { useTypedSelector } from '../state/reducers/RootReducer';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
interface PickingNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
}
export const PickTabNavigator = (): JSX.Element => (
  <Tab.Navigator initialRouteName="Pick">
    <Tab.Screen
      name="QuickPick"
      options={{
        title: strings('PICKING.QUICKPICK')
      }}
      component={QuickPickTab}
    />
    <Tab.Screen
      name="Pick"
      options={{
        title: strings('PICKING.PICK')
      }}
      component={PickBinTab}
    />
    <Tab.Screen
      name="SalesFloor"
      options={{
        title: strings('ITEM.SALES_FLOOR_QTY')
      }}
      component={SalesFloorTab}
    />
  </Tab.Navigator>
);

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
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

// TODO implement PickListTab navigator https://jira.walmart.com/browse/INTLSAOPS-5446
export const PickingNavigatorStack = (
  props: PickingNavigatorProps
): JSX.Element => {
  const { dispatch, isManualScanEnabled } = props;
  // TODO the focused Child Tab routeName is not active on the firstRender
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE,
        headerRight: () => (
          <View style={styles.headerContainer}>
            {getFocusedRouteNameFromRoute(route) === 'QuickPick' ||
            getFocusedRouteNameFromRoute(route) === 'Pick'
              ? renderScanButton(dispatch, isManualScanEnabled)
              : null}
          </View>
        )
      })}
    >
      <Stack.Screen
        name="PickingTabs"
        component={PickTabNavigator}
        options={{
          headerTitle: strings('PICKING.PICKING')
        }}
      />
      <Stack.Screen
        name="Picking"
        component={Picking}
        options={{
          headerTitle: strings('PICKING.PICKING')
        }}
      />
    </Stack.Navigator>
  );
};

const PickingNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);
  return (
    <PickingNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default PickingNavigator;
