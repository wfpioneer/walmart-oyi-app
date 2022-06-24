import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { strings } from '../locales';
import WorklistHome from '../screens/Worklist/WorklistHome';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();

export const WorklistHomeNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE

    }}
  >
    <Stack.Screen
      name="WorklistHome"
      component={WorklistHome}
      options={{
        headerTitle: strings('WORKLIST.WORKLIST')
      }}
    />
  </Stack.Navigator>
);

export const WorklistHomeNavigator = (): JSX.Element => (
  <WorklistHomeNavigatorStack />
);
