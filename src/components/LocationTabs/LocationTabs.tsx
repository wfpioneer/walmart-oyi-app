import React, { useEffect } from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { strings } from '../../locales';
import { FloorItem, LocationItem, Reserve } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabs.style';
import LocationHeader from '../locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { getSectionDetails } from '../../state/actions/saga';
import LocationDetails from '../../screens/LocationDetailsScreen/LocationDetailsScreen';
import FloorItemList from '../FloorItemList/FloorItemList';

const Tab = createMaterialTopTabNavigator();

interface LocationProps {
    floorItems: FloorItem[];
    reserveItems: Reserve[];
    locationName: string;
}

const ItemHeader = () : JSX.Element => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>
      {strings('LOCATION.ITEMS')}
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

export const LocationTabsStack = (props: LocationProps): JSX.Element => {
  const { locationName, floorItems, reserveItems } = props;
  return (
    <>
      {/* Pass this on the location management navigator?? */}
      <LocationHeader
        location={`${strings('LOCATION.SECTION')} ${locationName}`}
        details={`${floorItems.length ?? 0} ${strings('LOCATION.ITEMS')},`
        + ` ${reserveItems.length ?? 0} ${strings('LOCATION.PALLETS')}`}
      />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: COLOR.MAIN_THEME_COLOR,
          style: { backgroundColor: COLOR.WHITE },
          indicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
        }}
      >
        <Tab.Screen
          name={`${strings('LOCATION.FLOORS')} (${floorItems.length ?? 0})`}
        >
          {() => (
            <>
              <ItemHeader />
              <LocationDetails />
            </>
          )}
        </Tab.Screen>
        <Tab.Screen
          name={`${strings('LOCATION.RESERVES')} (${reserveItems.length ?? 0})`}
        >
          {() => (
            <>
              <ItemHeader />
              <LocationDetails />
            </>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

const LocationTabs = () : JSX.Element => {
  const { selectedAisle, selectedZone, selectedSection } = useTypedSelector(state => state.Location);
  const { result } = useTypedSelector(state => state.async.getSectionDetails);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const locItem: LocationItem | undefined = (result && result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;
  // Call Get Section Details
  useEffect(() => {
    validateSession(navigation, route.name).then(() => {
      dispatch(getSectionDetails({ sectionId: locationName }));
    }).catch(() => {});
  }, [navigation]);

  // TODO fix issue where Tab switches to Reserve after re-rendering
  return (
    <LocationTabsStack
      floorItems={locItem?.floor ?? []}
      reserveItems={locItem?.reserve ?? []}
      locationName={locationName}
    />
  );
};

export default LocationTabs;
