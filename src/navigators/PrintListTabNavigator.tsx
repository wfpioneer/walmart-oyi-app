import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { strings } from '../locales';
import PrintLists from '../screens/PrintList/PrintList';

const Tab = createMaterialTopTabNavigator();

export const PrintListTabNavigator = (): JSX.Element => (
  <Tab.Navigator>
    <Tab.Screen
      name="PriceSigns"
      options={{
        title: strings('PRINT.PRICE_SIGNS')
      }}
    >
      {() => <PrintLists tab="PRICESIGN" />}
    </Tab.Screen>
    <Tab.Screen
      name="Locations"
      options={{
        title: strings('PRINT.LOCATIONS')
      }}
    >
      {() => <PrintLists tab="LOCATION" />}
    </Tab.Screen>
  </Tab.Navigator>
);

const PrintListTabs = (): JSX.Element => (
  <PrintListTabNavigator />
);

export default PrintListTabs;
