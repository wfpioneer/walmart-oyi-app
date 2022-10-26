import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsTool from '../screens/SettingsTool/SettingsTool';
import COLOR from '../themes/Color';
import { strings } from '../locales';

const Stack = createStackNavigator();
export const SettingsToolNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerMode: 'float',
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE
    }}
  >
    <Stack.Screen
      name="SettingsToolHome"
      component={SettingsTool}
      options={{
        headerTitle: strings('SETTINGS.TITLE')
      }}
    />
  </Stack.Navigator>
);

const SettingsToolNavigator = (): JSX.Element => (
  <SettingsToolNavigatorStack />
);

export default SettingsToolNavigator;
