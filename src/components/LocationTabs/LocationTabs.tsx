import React from 'react';
import {
  Text, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { strings } from '../../locales';
import { LocationItem } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabs.style';
import ReservePalletList from '../ReservePalletList/ReservePalletList';

const Tab = createMaterialTopTabNavigator();

interface LocationProps {
   mockData: LocationItem
 }

const ReserveHeader = () : JSX.Element => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>
      {strings('LOCATION.PALLETS')}
    </Text>
    {/* <TouchableOpacity> */}
    {/*  <Text style={styles.clear}> */}
    {/*    {strings('LOCATION.CLEAR_ALL')} */}
    {/*  </Text> */}
    {/* </TouchableOpacity> */}
    {/* <Text style={styles.pipe}>|</Text> */}
    {/* <TouchableOpacity> */}
    {/*  <Text style={styles.add}> */}
    {/*    {strings('LOCATION.ADD')} */}
    {/*  </Text> */}
    {/* </TouchableOpacity> */}
  </View>

);

const ItemHeader = () : JSX.Element => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>
      {strings('LOCATION.ITEMS')}
    </Text>
    {/* <TouchableOpacity> */}
    {/*  <Text style={styles.clear}> */}
    {/*    {strings('LOCATION.REMOVE_ALL')} */}
    {/*  </Text> */}
    {/* </TouchableOpacity> */}
    {/* <Text style={styles.pipe}>|</Text> */}
    {/* <TouchableOpacity> */}
    {/*  <Text style={styles.add}> */}
    {/*    {strings('LOCATION.ADD')} */}
    {/*  </Text> */}
    {/* </TouchableOpacity> */}
  </View>
);

const LocationTabs = (props : LocationProps) : JSX.Element => {
  const { mockData } = props;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        inactiveTintColor: COLOR.GREY_700,
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
      >
        {() => (
          <>
            <ReserveHeader />
            <ReservePalletList reservePallets={mockData.reserve} />
          </>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default LocationTabs;
