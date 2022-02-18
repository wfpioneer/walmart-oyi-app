import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import PrintLists from '../screens/PrintList/PrintList';

const Tab = createMaterialTopTabNavigator();

const PrintListTabNavigator = (props: any): JSX.Element => (
  <Tab.Navigator>
    <Tab.Screen
      name="PriceSigns"
      options={{
        title: 'Price Signs'
      }}
    >
      {() => <PrintLists />}
    </Tab.Screen>
    <Tab.Screen
      name="Locations"
      options={{
        title: 'Locations'
      }}
    >
      {() => <PrintLists />}
    </Tab.Screen>
  </Tab.Navigator>
);

const PrintListTabs = (): JSX.Element => (<PrintListTabNavigator />);

export default PrintListTabs;
