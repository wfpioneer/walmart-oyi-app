import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import Picking from '../screens/Picking/Picking';

const Stack = createStackNavigator();
// TODO implement PickListTab navigator https://jira.walmart.com/browse/INTLSAOPS-5446
export const PickingNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE
    }}
  >
    <Stack.Screen
      name="Picking"
      component={Picking}
      options={{
        headerTitle: strings('PICKING.PICKING')
      }}
    />
  </Stack.Navigator>
);

const PickingNavigator = (): JSX.Element => <PickingNavigatorStack />;

export default PickingNavigator;
