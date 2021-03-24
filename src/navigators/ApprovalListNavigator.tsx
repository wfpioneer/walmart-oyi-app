import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ApprovalList from '../screens/ApprovalList/ApprovalList';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();
export const ApprovalListNavigator = () => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE
    }}
  >
    <Stack.Screen
      name="Approval"
      component={ApprovalList}
    />
  </Stack.Navigator>
);
