import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import LocationManagementNavigator from './LocationManagementNavigator';
import TabNavigator from './TabNavigator';
import ReviewItemDetailsNavigator from './ReviewItemDetailsNavigator';
import PrintPriceSignNavigator from './PrintPriceSignNavigator';
import PalletManagementNavigator from './PalletManagementNavigator';

const Stack = createStackNavigator();

export const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ReviewItemDetails" component={ReviewItemDetailsNavigator} />
      <Stack.Screen name="PrintPriceSign" component={PrintPriceSignNavigator} />
      <Stack.Screen name="LocationManagement" component={LocationManagementNavigator} />
      <Stack.Screen name="PalletManagement" component={PalletManagementNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);
