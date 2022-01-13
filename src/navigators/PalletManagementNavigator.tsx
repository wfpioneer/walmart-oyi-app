import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import PalletManagement from '../screens/PalletManagement/PalletManagement';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();

export const PalletManagementNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE,
      headerTitleStyle: { fontSize: 18 }
    }}
  >
    <Stack.Screen
      name="PalletManagement"
      component={PalletManagement}
      options={{
        headerTitle: 'Pallet Management'
      }}
    />
  </Stack.Navigator>
);

const PalletManagementNavigator = (): JSX.Element => (
  <PalletManagementNavigatorStack />
);

export default PalletManagementNavigator;
