import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from '../components/LocationTabs/LocationTabs';
import { GET_SECTION_DETAILS } from '../state/actions/asyncAPI';

const Stack = createStackNavigator();
interface LocationManagementProps {
  dispatch: Dispatch<any>
}

export const LocationManagementNavigatorStack = (props: LocationManagementProps): JSX.Element => {
  const { dispatch } = props;

  return (
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
        listeners={{
          blur: () => (
            dispatch({ type: GET_SECTION_DETAILS.RESET })
          )
        }}
      />
    </Stack.Navigator>
  );
};

const LocationManagementNavigator = (): JSX.Element => (
  <LocationManagementNavigatorStack
    dispatch={useDispatch()}
  />
);

export default LocationManagementNavigator;
