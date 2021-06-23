import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';

const Stack = createStackNavigator();

export const LocationManagementNavigatorStack = (): JSX.Element => (
  <Stack.Navigator
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE

    }}
  >
    <Stack.Screen
      name="Zones"
      component={() => (<ZoneList />)}
      options={{
        headerTitle: strings('LOCATION.ZONES')
      }}
    />
    <Stack.Screen
      name="Aisles"
      component={() => (<Text>Aisles</Text>)} // Create a screen and replace me!
      options={{
        headerTitle: strings('LOCATION.AISLES')
      }}
    />
    <Stack.Screen
      name="Sections"
      component={() => (<Text>Sections</Text>)} // Create a screen and replace me!
      options={{
        headerTitle: strings('LOCATION.SECTIONS')
      }}
    />
    <Stack.Screen
      name="LocationDetails"
      component={() => (<Text>Location Details</Text>)} // Create a screen and replace me!
      options={{
        headerTitle: strings('LOCATION.LOCATION_DETAILS')
      }}
    />
  </Stack.Navigator>
);

const LocationManagementNavigator = (): JSX.Element => (
  <LocationManagementNavigatorStack />
);

export default LocationManagementNavigator;
