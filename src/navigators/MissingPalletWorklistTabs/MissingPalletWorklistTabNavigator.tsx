import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { TodoPalletWorklist } from '../../screens/Worklist/TodoPalletWorklist';
import { CompletedPalletWorklist } from '../../screens/Worklist/CompletedPalletWorklist';

const Tab = createMaterialTopTabNavigator();

export const MissingPalletWorklistTabNavigator = (): JSX.Element => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: COLOR.WHITE,
      style: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      indicatorStyle: { backgroundColor: COLOR.WHITE }
    }}
  >
    <Tab.Screen
      name={strings('WORKLIST.TODO')}
      component={TodoPalletWorklist}
    />
    <Tab.Screen
      name={strings('WORKLIST.COMPLETED')}
      component={CompletedPalletWorklist}
    />
  </Tab.Navigator>
);

export const MissingPalletWorklistTabs = (): JSX.Element => (
  <MissingPalletWorklistTabNavigator />
);

export default MissingPalletWorklistTabs;
