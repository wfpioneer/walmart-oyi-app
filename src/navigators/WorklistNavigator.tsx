import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { strings } from '../locales';
import WorkLikstHome from '../screens/Worklist/WorkListHome';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();

export const WorkListNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE

    }}
  >
    <Stack.Screen
      name="WorkList"
      component={WorkLikstHome}
      options={{
        headerTitle: strings('WORKLIST.WORKLIST')
      }}
    />
  </Stack.Navigator>
);

export const WorkListNavigator = (): JSX.Element => (
  <WorkListNavigatorStack />
);
