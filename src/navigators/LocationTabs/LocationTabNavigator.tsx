import React, { Dispatch, EffectCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { strings } from '../../locales';
import { LocationItem, SectionDetailsItem, SectionDetailsPallet } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabNavigator.style';
import LocationHeader from '../../components/locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { getSectionDetails } from '../../state/actions/saga';
import SectionDetails from '../../screens/SectionDetails/SectionDetailsScreen';
import { trackEvent } from '../../utils/AppCenterTool';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setScannedEvent } from '../../state/actions/Global';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { resetLocations } from '../../state/actions/Location';

const Tab = createMaterialTopTabNavigator();

interface LocationProps {
    floorItems: SectionDetailsItem[];
    reserveItems: SectionDetailsPallet[];
    locationName: string;
    isManualScanEnabled: boolean;
    useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    route: RouteProp<any, string>;
    scannedEvent: {type?: string; value?: string};
    trackEventCall: (eventName: string, params?: any) => void;
    validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
}

// TODO uncomment this when we start implementing the rest of LocationManagement functionality
const ItemHeader = (): JSX.Element => (
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

const PalletHeader = (): JSX.Element => (
  <View style={styles.tabHeader}>
    <Text style={styles.tabHeaderText}>
      {strings('LOCATION.PALLETS')}
    </Text>
  </View>
);

const floorDetailsList = () => (
  <>
    <ItemHeader />
    <SectionDetails />
  </>
);

const reserveDetailsList = () => (
  <>
    <PalletHeader />
    <SectionDetails />
  </>
);

export const LocationTabsNavigator = (props: LocationProps): JSX.Element => {
  const {
    locationName,
    floorItems,
    reserveItems,
    isManualScanEnabled,
    dispatch,
    navigation,
    scannedEvent,
    route,
    trackEventCall,
    useEffectHook,
    validateSessionCall
  } = props;

  // Call Get Section Details
  useEffectHook(() => {
    validateSessionCall(navigation, route.name).then(() => {
      if (scannedEvent.value) {
        // Reset Location State on new getSectionDetails request to update header
        dispatch(resetLocations());
        dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
      }
    }).catch(() => {});
  }, [navigation, scannedEvent]);

  // scanned event listener
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEventCall('section_details_scan', { value: scan.value, type: scan.type });
          dispatch(setScannedEvent(scan));
        });
      }
    });
    return () => {
      scanSubscription.remove();
    };
  }, []);

  return (
    <>
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('LOCATION.SECTION')}`
         + ` ${locationName === '-' ? scannedEvent.value?.toUpperCase() : locationName}`}
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
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { scannedEvent } = useTypedSelector(state => state.Global);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const locItem: LocationItem | undefined = (result && result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;

  return (
    <LocationTabsNavigator
      floorItems={locItem?.floor ?? []}
      reserveItems={locItem?.reserve ?? []}
      locationName={locationName}
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      scannedEvent={scannedEvent}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
    />
  );
};

export default LocationTabs;
