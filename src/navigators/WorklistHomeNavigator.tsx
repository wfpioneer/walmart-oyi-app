import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { strings } from '../locales';
import WorklistHome from '../screens/Worklist/WorklistHome';
import COLOR from '../themes/Color';
import AuditWorklistNavigator from './AuditWorklistNavigator';
import MissingPalletWorklistNavigator from './MissingPalletWorklistNavigator';
import { WorklistNavigator } from './WorklistNavigator';

const Stack = createStackNavigator();

export const WorklistHomeNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerMode: 'float',
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
    <Stack.Screen
      name="WorklistNavigator"
      component={WorklistNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MissingPalletWorklist"
      component={MissingPalletWorklistNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AuditWorklistNavigator"
      component={AuditWorklistNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export const WorklistHomeNavigator = (): JSX.Element => (
  <WorklistHomeNavigatorStack />
);
