import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelectLocationType from '../screens/SelectLocationType/SelectLocationType';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from './LocationTabs/LocationTabNavigator';

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
    <Stack.Screen
      name="AddLocation"
      component={SelectLocationType}
      options={{
        headerTitle: strings('LOCATION.ADD_NEW_LOCATION'),
        headerTitleAlign: 'left',
        headerTitleStyle: { fontSize: 18 },
        headerBackTitleVisible: false
      }}
    />
  </Stack.Navigator>
);

const LocationManagementNavigator = (): JSX.Element => (
  <LocationManagementNavigatorStack />
);

export default LocationManagementNavigator;
