import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { strings } from '../locales';
import Tools from '../screens/Tools/Tools';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();
// TODO Tab navigator should be seen on this screen
export const ToolsNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
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

export const ToolsNavigator = (): JSX.Element => (
  <ToolsNavigatorStack />
);
