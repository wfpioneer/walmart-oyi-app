import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import LocationManagementNavigator from './LocationManagementNavigator';
import TabNavigator from './TabNavigator';
import ReviewItemDetailsNavigator from './ReviewItemDetailsNavigator';
import PrintPriceSignNavigator from './PrintPriceSignNavigator';
import PalletManagementNavigator from './PalletManagementNavigator';
import Settings from '../screens/Settings/Settings';
import { strings } from '../locales';
import COLOR from '../themes/Color';

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
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: strings('GENERICS.SETTINGS'),
          headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          headerTintColor: COLOR.WHITE,
          headerShown: true
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
