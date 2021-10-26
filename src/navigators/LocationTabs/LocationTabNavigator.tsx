import React, { useEffect } from 'react';
import {
  Text, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { strings } from '../../locales';
import { LocationItem, SectionDetailsItem, SectionDetailsPallet } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabNavigator.style';
import LocationHeader from '../../components/locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { getSectionDetails } from '../../state/actions/saga';
import SectionDetails from '../../screens/SectionDetails/SectionDetailsScreen';
import Button from '../../components/buttons/Button';

const Tab = createMaterialTopTabNavigator();

interface LocationProps {
    floorItems: SectionDetailsItem[];
    reserveItems: SectionDetailsPallet[];
    locationName: string;
}

interface HeaderProps {
    headerText: string;
}

export const Header = (props: HeaderProps): JSX.Element => {
  const { headerText } = props;
  const navigation = useNavigation();
  const addNewLocation = () => {
    navigation.navigate('AddLocation');
  };
  return (
    <>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>
          {headerText}
        </Text>
        <Button
          type={3}
          title={strings('GENERICS.ADD')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          titleFontSize={12}
          titleFontWeight="bold"
          height={28}
          onPress={() => addNewLocation()}
        />
      </View>
    </>
  );
};

const floorDetailsList = () => (
  <>
    <Header headerText={strings('LOCATION.ITEMS')} />
    <SectionDetails />
  </>
);

const reserveDetailsList = () => (
  <>
    <Header headerText={strings('LOCATION.PALLETS')} />
    <SectionDetails />
  </>
);

export const LocationTabsNavigator = (props: LocationProps): JSX.Element => {
  const { locationName, floorItems, reserveItems } = props;
  return (
    <>
      <LocationHeader
        location={`${strings('LOCATION.SECTION')} ${locationName}`}
        details={`${floorItems.length ?? 0} ${strings('LOCATION.ITEMS')},`
        + ` ${reserveItems.length ?? 0} ${strings('LOCATION.PALLETS')}`}
      />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: COLOR.MAIN_THEME_COLOR,
          inactiveTintColor: COLOR.GREY_700,
          style: { backgroundColor: COLOR.WHITE },
          indicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
        }}
      >
        <Tab.Screen
          name="FloorDetails"
          component={floorDetailsList}
          options={{
            title: `${strings('LOCATION.FLOORS')} (${floorItems.length ?? 0})`
          }}
        />
        <Tab.Screen
          name="ReserveDetails"
          component={reserveDetailsList}
          options={{
            title: `${strings('LOCATION.RESERVES')} (${reserveItems.length ?? 0})`
          }}
        />
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

  return (
    <LocationTabsNavigator
      floorItems={locItem?.floor ?? []}
      reserveItems={locItem?.reserve ?? []}
      locationName={locationName}
    />
  );
};

export default LocationTabs;
