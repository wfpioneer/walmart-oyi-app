import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import LocationManagementNavigator from './LocationManagementNavigator';
import TabNavigator from './TabNavigator';
import ReviewItemDetailsNavigator from './ReviewItemDetailsNavigator';
import PrintPriceSignNavigator from './PrintPriceSignNavigator';
import PalletManagementNavigator from './PalletManagementNavigator';
import SettingsToolNavigator from './SettingsToolNavigator';
import BinningNavigator from './BinningNavigator';
import { PickTabNavigator } from './PickTabNavigator';

const Stack = createStackNavigator();

export const MainNavigator = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ReviewItemDetails" component={ReviewItemDetailsNavigator} />
      <Stack.Screen name="PrintPriceSign" component={PrintPriceSignNavigator} />
      <Stack.Screen name="LocationManagement" component={LocationManagementNavigator} />
      <Stack.Screen name="PalletManagement" component={PalletManagementNavigator} />
      <Stack.Screen name="SettingsTool" component={SettingsToolNavigator} />
      <Stack.Screen name="Binning" component={BinningNavigator} />
      <Stack.Screen name="Picking" component={PickTabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);
