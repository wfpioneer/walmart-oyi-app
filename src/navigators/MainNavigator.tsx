import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFlipper } from '@react-navigation/devtools';
import Login from '../screens/Login/Login';
import TabNavigator from './TabNavigator';
import ReviewItemDetailsNavigator from './ReviewItemDetailsNavigator';
import PrintPriceSignNavigator from './PrintPriceSignNavigator';
import PalletManagementNavigator from './PalletManagementNavigator';
import SettingsToolNavigator from './SettingsToolNavigator';
import BinningNavigator from './BinningNavigator';
import PickingNavigator from './PickingNavigator';
import { WorklistNavigator } from './WorklistNavigator';

const Stack = createStackNavigator();

export const MainNavigator = (): JSX.Element => {
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen
          name="ReviewItemDetails"
          component={ReviewItemDetailsNavigator}
        />
        <Stack.Screen name="PrintPriceSign" component={PrintPriceSignNavigator} />

        <Stack.Screen
          name="PalletManagement"
          component={PalletManagementNavigator}
        />
        <Stack.Screen name="SettingsTool" component={SettingsToolNavigator} />
        <Stack.Screen name="Binning" component={BinningNavigator} />
        <Stack.Screen name="Picking" component={PickingNavigator} />
        <Stack.Screen name="WorklistNavigator" component={WorklistNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
