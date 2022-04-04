import React, { Dispatch, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import PickBinTab from '../screens/PickBinTab/PickBinTab';
import PickBinWorkflow from '../screens/PickBinWorkflow/PickBinWorkflowScreen';
import CreatePick from '../screens/CreatePick/CreatePick';
import QuickPickTab from '../screens/QuickPickTab/QuickPickTabScreen';
import SalesFloorTab from '../screens/SalesFloorTab/SalesFloorTabScreen';
import { setManualScan } from '../state/actions/Global';
import styles from './PickingNavigator.style';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { PickListItem, PickStatus } from '../models/Picking.d';
import { mockPickLists } from '../mockData/mockPickList';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
// eslint-disable-next-line no-shadow
enum Tabs {
  QUICKPICK,
  PICK,
  SALESFLOOR
}
interface PickingNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  picklist: PickListItem[];
  selectedTab: Tabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<Tabs>>
}
export const PickTabNavigator = (props: {
  picklist: PickListItem[];
  setSelectedTab: React.Dispatch<React.SetStateAction<Tabs>>;
}): JSX.Element => {
  const { picklist, setSelectedTab } = props;

  const quickPickList = picklist.filter(item => item.quickPick);
  const pickBinList = picklist.filter(
    item => !item.quickPick
      && (item.status === PickStatus.ACCEPTED_BIN
        || item.status === PickStatus.ACCEPTED_PICK
        || item.status === PickStatus.READY_TO_BIN
        || item.status === PickStatus.READY_TO_PICK)
  );
  const salesFloorList = picklist.filter(
    item => item.quickPick && item.status === PickStatus.READY_TO_WORK
  );

  return (
    <Tab.Navigator initialRouteName="Pick">
      <Tab.Screen
        name="QuickPick"
        options={{
          title: strings('PICKING.QUICKPICK')
        }}
        listeners={{
          focus: () => setSelectedTab(Tabs.QUICKPICK)
        }}
        component={QuickPickTab}
      />
      <Tab.Screen
        name="Pick"
        options={{
          title: strings('PICKING.PICK')
        }}
        listeners={{
          focus: () => setSelectedTab(Tabs.PICK)
        }}
        component={PickBinTab}
      />
      <Tab.Screen
        name="SalesFloor"
        options={{
          title: strings('ITEM.SALES_FLOOR_QTY')
        }}
        listeners={{
          focus: () => setSelectedTab(Tabs.SALESFLOOR)
        }}
        component={SalesFloorTab}
      />
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

// TODO implement PickListTab navigator https://jira.walmart.com/browse/INTLSAOPS-5446
export const PickingNavigatorStack = (
  props: PickingNavigatorProps
): JSX.Element => {
  const {
    dispatch, isManualScanEnabled, picklist,
    selectedTab, setSelectedTab
  } = props;

  let createPickTitle = '';
  if (selectedTab === Tabs.PICK) {
    createPickTitle = strings('PICKING.CREATE_PICK');
  } else if (selectedTab === Tabs.QUICKPICK) {
    createPickTitle = strings('CREATE_QUICK_PICK');
  }

  return (
    <Stack.Navigator
      headerMode="float"
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
        {() => <PickTabNavigator picklist={picklist} setSelectedTab={setSelectedTab} />}
      </Stack.Screen>
      <Stack.Screen
        name="PickBinWorkflow"
        // TODO: Placeholder for PickBinWorkflow
        component={PickBinWorkflow}
        options={{
          headerTitle: strings('PICKING.PICKING')
        }}
      />
      <Stack.Screen
        name="CreatePick"
        options={{
          headerTitle: createPickTitle
        }}
        component={CreatePick}
      />
    </Stack.Navigator>
  );
};

const PickingNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.PICK);
  return (
    <PickingNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      picklist={mockPickLists}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  );
};

export default PickingNavigator;
