import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { strings } from '../locales';
import Tools from '../screens/Tools/Tools';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();

export const ToolsNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerMode: 'float',
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE
    }}
  >
    <Stack.Screen
      name="Tools"
      component={Tools}
      options={{
        headerTitle: strings('GENERICS.TOOLS')
      }}
    />
  </Stack.Navigator>
);

export const ToolsNavigator = (): JSX.Element => <ToolsNavigatorStack />;
