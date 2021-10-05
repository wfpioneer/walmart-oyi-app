import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from '../components/LocationTabs/LocationTabs';

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
      component={ZoneList}
      options={{
        headerTitle: strings('LOCATION.ZONES')
      }}
    />
    <Stack.Screen
      name="Aisles"
      component={AisleList}
      options={{
        headerTitle: strings('LOCATION.AISLES')
      }}
    />
    <Stack.Screen
      name="Sections"
      component={SectionList}
      options={{
        headerTitle: strings('LOCATION.SECTIONS')
      }}
    />
    <Stack.Screen
      name="LocationDetails"
      component={LocationTabs}
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
