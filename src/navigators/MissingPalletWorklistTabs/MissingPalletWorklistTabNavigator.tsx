import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';

const Tab = createMaterialTopTabNavigator();

export const MissingPalletWorklistTabNavigator = (): JSX.Element => {
  // TODO: Need to replace placeholder component
  const TodoWorklistPlaceholder = () => <View />;
  const CompletedWorklistPlaceholder = () => <View />;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLOR.WHITE,
        style: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        indicatorStyle: { backgroundColor: COLOR.WHITE }
      }}
    >
      <Tab.Screen
        name={strings('WORKLIST.TODO')}
        component={TodoWorklistPlaceholder}
      />
      <Tab.Screen
        name={strings('WORKLIST.COMPLETED')}
        component={CompletedWorklistPlaceholder}
      />
    </Tab.Navigator>
  );
};

export const MissingPalletWorklistTabs = (): JSX.Element => (
  <MissingPalletWorklistTabNavigator />
);

export default MissingPalletWorklistTabs;
