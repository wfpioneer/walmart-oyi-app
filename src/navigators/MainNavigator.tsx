import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState, AppStateStatus } from 'react-native';
import Login from '../screens/Login/Login';
import LocationManagementNavigator from './LocationManagementNavigator';
import TabNavigator from './TabNavigator';
import ReviewItemDetailsNavigator from './ReviewItemDetailsNavigator';
import PrintPriceSignNavigator from './PrintPriceSignNavigator';
import PalletManagementNavigator from './PalletManagementNavigator';
import SettingsToolNavigator from './SettingsToolNavigator';
import BinningNavigator from './BinningNavigator';
import PickingNavigator from './PickingNavigator';
import { disableScanner, enableScanner } from '../utils/scannerUtils';

const Stack = createStackNavigator();

export const MainNavigator = (): JSX.Element => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const callAppState = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background|active/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        enableScanner();
      } else {
        disableScanner();
      }
      appState.current = nextAppState;
    };

    AppState.addEventListener('change', callAppState);

    return () => {
      AppState.removeEventListener('change', callAppState);
    };
  }, []);

  return (
    <NavigationContainer>
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
        <Stack.Screen
          name="PrintPriceSign"
          component={PrintPriceSignNavigator}
        />
        <Stack.Screen
          name="LocationManagement"
          component={LocationManagementNavigator}
        />
        <Stack.Screen
          name="PalletManagement"
          component={PalletManagementNavigator}
        />
        <Stack.Screen name="SettingsTool" component={SettingsToolNavigator} />
        <Stack.Screen name="Binning" component={BinningNavigator} />
        <Stack.Screen name="Picking" component={PickingNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
