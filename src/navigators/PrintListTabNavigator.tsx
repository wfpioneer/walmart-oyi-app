import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { strings } from '../locales';
import PrintLists from '../screens/PrintList/PrintList';

const Tab = createMaterialTopTabNavigator();

export const PrintListTabNavigator = (): JSX.Element => (
  <Tab.Navigator>
    <Tab.Screen
      name="PriceSigns"
      component={PrintLists}
      options={{
        title: strings('PRINT.PRICE_SIGNS')
      }}
    />
    <Tab.Screen
      name="Locations"
      component={PrintLists}
      options={{
        title: strings('PRINT.LOCATIONS')
      }}
    />
  </Tab.Navigator>
);

const PrintListTabs = (): JSX.Element => (<PrintListTabNavigator />);

export default PrintListTabs;
