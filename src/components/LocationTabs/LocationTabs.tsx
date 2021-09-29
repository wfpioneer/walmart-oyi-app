import React from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { strings } from '../../locales';
import { Floor, Reserve } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabs.style';

const Tab = createMaterialTopTabNavigator();

interface LocationProps {
    floorItems: Floor[];
    reserveItems: Reserve[];
}

const ItemHeader = () : JSX.Element => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>
      {strings('LOCATION.ITEMS')}
    </Text>
    <TouchableOpacity>
      <Text style={styles.clear}>
        {strings('LOCATION.CLEAR_ALL')}
      </Text>
    </TouchableOpacity>
    <Text style={styles.pipe}>|</Text>
    <TouchableOpacity>
      <Text style={styles.add}>
        {strings('LOCATION.ADD')}
      </Text>
    </TouchableOpacity>
  </View>
);

const LocationTabs = (props : LocationProps) : JSX.Element => {
  const { floorItems, reserveItems } = props;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        style: { backgroundColor: COLOR.WHITE },
        indicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
      }}
    >
      <Tab.Screen
        name={`${strings('LOCATION.FLOORS')} (${floorItems.length})`}
        component={ItemHeader}
      />
      <Tab.Screen
        name={`${strings('LOCATION.RESERVES')} (${reserveItems.length})`}
        component={ItemHeader}
      />
    </Tab.Navigator>
  );
};

export default LocationTabs;
