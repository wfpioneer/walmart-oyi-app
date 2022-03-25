import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { strings } from '../locales';
import PickBinTab from '../screens/PickBinTab/PickBinTabScreen';
import QuickPickTab from '../screens/QuickPickTab/QuickPickTabScreen';
import SalesFloorTab from '../screens/SalesFloorTab/SalesFloorTabScreen';

const Tab = createMaterialTopTabNavigator();

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

const PickTab = () => <PickTabNavigator />;

export default PickTab;
