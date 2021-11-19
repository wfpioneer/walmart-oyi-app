import React, {
  EffectCallback, useEffect, useMemo, useRef
} from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Dispatch } from 'redux';
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
import { hideLocationPopup } from '../../state/actions/Location';

import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import BottomSheetRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import Button from '../../components/buttons/Button';
import { setPrintingLocationLabels } from '../../state/actions/Print';
import { LocationName } from '../../models/Location';

const Tab = createMaterialTopTabNavigator();

export interface LocationProps {
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
    locationPopupVisible: boolean;
}

interface TabHeaderProps {
    headerText: string;
    isEditEnabled: boolean;
    isReserve: boolean;
}

export const TabHeader = (props: TabHeaderProps): JSX.Element => {
  const { headerText, isEditEnabled, isReserve } = props;
  const navigation = useNavigation();
  const addNewLocation = () => {
    navigation.navigate('AddLocation');
  };
  const addNewPallet = () => {
    navigation.navigate('AddPallet');
  };
  return (
    <>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderText}>
          {headerText}
        </Text>
        {isEditEnabled ? (
          <Button
            type={3}
            title={strings('GENERICS.ADD')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={12}
            titleFontWeight="bold"
            height={28}
            onPress={isReserve ? () => addNewPallet() : () => addNewLocation()}
          />
        ) : null}
      </View>
    </>
  );
};

const floorDetailsList = () => {
  const userFeatures = useTypedSelector(state => state.User.features);
  return (
    <>
      <TabHeader
        headerText={strings('LOCATION.ITEMS')}
        isEditEnabled={userFeatures.includes('location management edit')}
        isReserve={false}
      />
      <SectionDetails />
    </>
  );
};

const reserveDetailsList = () => {
  const userFeatures = useTypedSelector(state => state.User.features);
  return (
    <>
      <TabHeader
        headerText={strings('LOCATION.PALLETS')}
        isEditEnabled={userFeatures.includes('location management edit')}
        isReserve={true}
      />
      <SectionDetails />
    </>
  );
};

export const LocationTabsNavigator = (props: LocationProps): JSX.Element => {
  const {
    locationName,
    locationPopupVisible,
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
        dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
      }
    }).catch(() => {});
  }, [navigation, scannedEvent]);

  // scanned event listener
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSessionCall(navigation, route.name).then(() => {
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
         + ` ${/* scannedEvent.type === 'sectionId' && scannedEvent.value
           ? scannedEvent.value?.toUpperCase()
           : */ locationName}`}
        details={`${floorItems.length ?? 0} ${strings('LOCATION.ITEMS')},`
        + ` ${reserveItems.length ?? 0} ${strings('LOCATION.PALLETS')}`}
        buttonPress={() => {
          dispatch(setPrintingLocationLabels(LocationName.SECTION));
          navigation.navigate('PrintPriceSign');
        }}
        buttonText={strings('LOCATION.PRINT_LABEL')}
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
          listeners={{
            tabPress: e => {
              if (locationPopupVisible) {
                e.preventDefault();
                dispatch(hideLocationPopup());
              }
            }
          }}
        />
        <Tab.Screen
          name="ReserveDetails"
          component={reserveDetailsList}
          options={{
            title: `${strings('LOCATION.RESERVES')} (${reserveItems.length ?? 0})`
          }}
          listeners={{
            tabPress: e => {
              if (locationPopupVisible) {
                e.preventDefault();
                dispatch(hideLocationPopup());
              }
            }
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
  const userFeatures = useTypedSelector(state => state.User.features);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const locItem: LocationItem | undefined = (result && result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;

  const bottomSheetLocationDetailsModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['35%', '50%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetLocationDetailsModalRef.current) {
      if (locationPopupVisible) {
        bottomSheetLocationDetailsModalRef.current.present();
      } else {
        bottomSheetLocationDetailsModalRef.current.dismiss();
      }
    }
  }, [locationPopupVisible]);

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!locationPopupVisible}
        style={styles.container}
      >
        <LocationTabsNavigator
          dispatch={dispatch}
          floorItems={locItem?.floor ?? []}
          reserveItems={locItem?.reserve ?? []}
          locationName={locationName}
          locationPopupVisible={locationPopupVisible}
          isManualScanEnabled={isManualScanEnabled}
          useEffectHook={useEffect}
          navigation={navigation}
          route={route}
          scannedEvent={scannedEvent}
          trackEventCall={trackEvent}
          validateSessionCall={validateSession}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetLocationDetailsModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetView>
          <BottomSheetClearCard
            onPress={() => {}}
            text={strings('LOCATION.CLEAR_SECTION')}
            isManagerOption={false}
            isVisible={true}
          />
          <BottomSheetRemoveCard
            onPress={() => {}}
            text={strings('LOCATION.REMOVE_SECTION')}
            isVisible={userFeatures.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default LocationTabs;
