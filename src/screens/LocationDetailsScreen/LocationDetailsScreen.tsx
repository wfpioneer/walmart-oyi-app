import React from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { mockLocationDetails } from '../../mockData/locationDetails';
import { LocationItem } from '../../models/LocationItems';
import styles from './LocationDetailsScreen.style';

import COLOR from '../../themes/Color';

const Tab = createMaterialTopTabNavigator();

interface LocationDetailProps {
  sectionName: string,
  mockData: LocationItem
}

interface LocationProps {
  mockData: LocationItem
}

const ItemHeader = () : JSX.Element => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>
      Items
    </Text>
    <TouchableOpacity>
      <Text style={styles.clear}>Clear all</Text>
    </TouchableOpacity>
    <Text style={styles.pipe}>|</Text>
    <TouchableOpacity>
      <Text style={styles.add}>Add</Text>
    </TouchableOpacity>
  </View>
);

const LocationTabs = (props : LocationProps) : JSX.Element => {
  const { mockData } = props;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        style: { backgroundColor: COLOR.WHITE },
        indicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
      }}
    >
      <Tab.Screen
        name={`${strings('LOCATION.FLOORS')} (${mockData.floor.length})`}
        component={ItemHeader}
      />
      <Tab.Screen
        name={`${strings('LOCATION.RESERVES')} (${mockData.reserve.length})`}
        component={ItemHeader}
      />
    </Tab.Navigator>
  );
};

export const LocationDetailsScreen = (props: LocationDetailProps) : JSX.Element => {
  const {
    sectionName,
    mockData
  } = props;

  const floor = mockData.floor.length;
  const reserve = mockData.reserve.length;

  return (
    <View>
      <LocationHeader
        location={sectionName}
        details={`${floor} ${strings('LOCATION.ITEMS')}, ${reserve} ${strings('LOCATION.PALLETS')}`}
      />
    </View>
  );
};

const LocationDetails = (): JSX.Element => {
  const sectionName = useTypedSelector(state => state.Location.selectedSection.name);

  return (
    <>
      <LocationDetailsScreen
        sectionName={sectionName}
        mockData={mockLocationDetails}
      />
      <LocationTabs
        mockData={mockLocationDetails}
      />
    </>
  );
};

export default LocationDetails;
