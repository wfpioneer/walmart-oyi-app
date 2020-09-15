import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import { TabNavigator } from './TabNavigator';
import ReviewItemDetailsNavigator from './ReviewItemDetailsNavigator';
import PrintPriceSignNavigator from './PrintPriceSignNavigator';

const Stack = createStackNavigator();

export const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ReviewItemDetails" component={ReviewItemDetailsNavigator} />
      <Stack.Screen name="PrintPriceSign" component={PrintPriceSignNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);
