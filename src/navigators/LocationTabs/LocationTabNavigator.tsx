import React, {
  EffectCallback, useEffect, useMemo, useRef, useState
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
import {
  clearLocation, getSectionDetails, removeSection
} from '../../state/actions/saga';
import SectionDetails from '../../screens/SectionDetails/SectionDetailsScreen';
import { trackEvent } from '../../utils/AppCenterTool';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setScannedEvent } from '../../state/actions/Global';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { hideItemPopup, hideLocationPopup } from '../../state/actions/Location';

import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import BottomSheetRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import Button from '../../components/buttons/Button';
import { setPrintingLocationLabels } from '../../state/actions/Print';
import { ClearLocationTarget, LocationName } from '../../models/Location';
import ReserveSectionDetails from '../../screens/SectionDetails/ReserveSectionDetails';
import ApiConfirmationModal from '../../screens/Modal/ApiConfirmationModal';
import { AsyncState } from '../../models/AsyncState';
import { showSnackBar } from '../../state/actions/SnackBar';
import { LocationIdName } from '../../state/reducers/Location';
import { REMOVE_SECTION } from '../../state/actions/asyncAPI';

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
    userFeatures: string[];
    itemPopupVisible:boolean;
    sectionResult: any;
    clearSectionApi: AsyncState;
    setSelectedTab: React.Dispatch<React.SetStateAction<ClearLocationTarget | undefined>>;
    setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    removeSectionApi: AsyncState;
    displayRemoveConfirmation: boolean;
    setDisplayRemoveConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    section: LocationIdName;
    displayClearConfirmation: boolean;
    selectedTab: ClearLocationTarget | undefined;
}

interface TabHeaderProps {
    headerText: string;
    isEditEnabled: boolean;
    isReserve: boolean;
    isDisabled: boolean;
}

export const handleClearSection = (
  dispatch: Dispatch<any>,
  locationId: number,
  target: ClearLocationTarget
): void => {
  dispatch(clearLocation({ locationId, target }));
};

export const handleClearModalClose = (
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>
): void => {
  setDisplayClearConfirmation(false);
  dispatch({ type: 'API/CLEAR_LOCATION/RESET' });
};

export const getSectionDetailsEffect = (
  validateSessionCall: (navigation: NavigationProp<any>, routeName: any) => any,
  route: RouteProp<any, string>,
  scannedEvent: { value?: string, type?: string },
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
): void => {
  validateSessionCall(navigation, route.name).then(() => {
    // Handles scanned event changes if the screen is in focus
    if (scannedEvent.value && navigation.isFocused()) {
      dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
      navigation.navigate('FloorDetails');
    }
  }).catch(() => {});
};

export const clearSectionApiEffect = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  clearSectionApi: AsyncState,
  section: LocationIdName,
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (navigation.isFocused() && !clearSectionApi.isWaiting) {
    if (clearSectionApi.result) {
      // Success
      handleClearModalClose(setDisplayClearConfirmation, dispatch);
      const selectedTab: ClearLocationTarget = clearSectionApi.value.target;
      if (selectedTab === ClearLocationTarget.FLOOR) {
        // TODO refactor screen to put section details information into redux so we
        // need to clear only that for this part
        dispatch({ type: 'API/GET_SECTION_DETAILS/RESET' });
        dispatch(getSectionDetails({ sectionId: section.id.toString() }));
      } else {
        dispatch({ type: 'API/GET_PALLET_DETAILS/RESET' });
      }
      dispatch(showSnackBar(selectedTab === ClearLocationTarget.FLOOR
        ? strings('LOCATION.CLEAR_SECTION_SALES_FLOOR_SUCCEED')
        : strings('LOCATION.CLEAR_SECTION_RESERVE_SUCCEED'), 3000));
    }
  }
};

export const TabHeader = (props: TabHeaderProps): JSX.Element => {
  const {
    headerText, isEditEnabled, isReserve, isDisabled
  } = props;
  const navigation = useNavigation();
  const addNewLocation = () => {
    navigation.navigate('AddItems');
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
            titleColor={isDisabled ? COLOR.DISABLED_BLUE : COLOR.MAIN_THEME_COLOR}
            titleFontSize={12}
            titleFontWeight="bold"
            height={28}
            onPress={isReserve ? () => addNewPallet() : () => addNewLocation()}
            disabled={isDisabled}
          />
        ) : null}
      </View>
    </>
  );
};

const FloorDetailsList = (props: {sectionExists: boolean}) => {
  const userFeatures = useTypedSelector(state => state.User.features);
  const { sectionExists } = props;
  return (
    <>
      <TabHeader
        headerText={strings('LOCATION.ITEMS')}
        isEditEnabled={userFeatures.includes('location management edit')}
        isReserve={false}
        isDisabled={!sectionExists}
      />
      <SectionDetails />
    </>
  );
};

const ReserveDetailsList = (props: {sectionExists: boolean}) => {
  const userFeatures = useTypedSelector(state => state.User.features);
  const { sectionExists } = props;


  return (
    <>
      <TabHeader
        headerText={strings('LOCATION.PALLETS')}
        isEditEnabled={userFeatures.includes('location management edit')}
        isReserve={true}
        isDisabled={!sectionExists}
      />
      <ReserveSectionDetails />
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
    validateSessionCall,
    userFeatures,
    itemPopupVisible,
    sectionResult,
    setSelectedTab,
    clearSectionApi,
    displayClearConfirmation,
    setDisplayClearConfirmation,
    removeSectionApi,
    displayRemoveConfirmation,
    setDisplayRemoveConfirmation,
    section,
    selectedTab
  } = props;
  const sectionExists: boolean = (sectionResult && sectionResult.status !== 204);

  // Call Get Section Details
  useEffectHook(() => getSectionDetailsEffect(
    validateSessionCall,
    route,
    scannedEvent,
    navigation,
    dispatch
  ), [navigation, scannedEvent]);

  // Clear Section API
  useEffectHook(() => clearSectionApiEffect(
    dispatch,
    navigation,
    clearSectionApi,
    section,
    setDisplayClearConfirmation
  ), [clearSectionApi]);

  // scanned event listener
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        // TODO when scanning for a new location we should reset to the Floor Tab
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

  // Remove Section Api
  useEffectHook(() => {
    // on api success
    if (!removeSectionApi.isWaiting && removeSectionApi.result) {
      setDisplayRemoveConfirmation(false);
      dispatch({ type: REMOVE_SECTION.RESET });
      dispatch(hideLocationPopup());
      navigation.goBack();
    }
  });

  return (
    <>
      <ApiConfirmationModal
        api={removeSectionApi}
        handleConfirm={() => dispatch(removeSection(section.id))}
        isVisible={displayRemoveConfirmation}
        mainText={`${strings('LOCATION.REMOVE_SECTION_CONFIRMATION', { sectionName: locationName })}`}
        onClose={() => setDisplayRemoveConfirmation(false)}
      />
      <ApiConfirmationModal
        isVisible={displayClearConfirmation}
        onClose={() => handleClearModalClose(setDisplayClearConfirmation, dispatch)}
        api={clearSectionApi}
        mainText={strings('LOCATION.CLEAR_SECTION_CONFIRMATION')}
        subtext1={selectedTab === ClearLocationTarget.FLOOR
          ? strings('LOCATION.CLEAR_SECTION_SALES_FLOOR_MESSAGE')
          : strings('LOCATION.CLEAR_SECTION_RESERVE_MESSAGE')}
        subtext2={strings('LOCATION.CLEAR_SECTION_WONT_DELETE')}
        handleConfirm={() => selectedTab
          && handleClearSection(dispatch, section.id, selectedTab)}
        errorText={strings('LOCATION.CLEAR_SECTION_FAIL')}
      />
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
        buttonText={userFeatures.includes('location printing') ? strings('LOCATION.PRINT_LABEL') : undefined}
        isDisabled={!sectionExists}
      />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: COLOR.MAIN_THEME_COLOR,
          inactiveTintColor: COLOR.GREY_700,
          style: { backgroundColor: COLOR.WHITE },
          indicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
        }}
        swipeEnabled={sectionExists}
      >
        <Tab.Screen
          name="FloorDetails"
          options={{
            title: `${strings('LOCATION.FLOORS')} (${floorItems.length ?? 0})`
          }}
          listeners={{
            tabPress: e => {
              if (locationPopupVisible) {
                e.preventDefault();
                dispatch(hideLocationPopup());
              }
            },
            focus: () => setSelectedTab(ClearLocationTarget.FLOOR)
          }}
        >
          { () => <FloorDetailsList sectionExists={sectionExists} />}
        </Tab.Screen>
        <Tab.Screen
          name="ReserveDetails"
          options={{
            title: `${strings('LOCATION.RESERVES')} (${reserveItems.length ?? 0})`
          }}
          listeners={{
            tabPress: e => {
              if (!sectionExists) {
                e.preventDefault();
              }
              if (locationPopupVisible) {
                e.preventDefault();
                dispatch(hideLocationPopup());
              }
              if (itemPopupVisible) {
                dispatch(hideItemPopup());
              }
            },
            focus: () => setSelectedTab(ClearLocationTarget.RESERVE)
          }}
        >
          {() => <ReserveDetailsList sectionExists={sectionExists} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

const LocationTabs = () : JSX.Element => {
  const { selectedAisle, selectedZone, selectedSection } = useTypedSelector(state => state.Location);
  const { result } = useTypedSelector(state => state.async.getSectionDetails);
  const clearSectionApi = useTypedSelector(state => state.async.clearLocation);
  const removeSectionApi = useTypedSelector(state => state.async.removeSection);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const userFeatures = useTypedSelector(state => state.User.features);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const itemPopupVisible = useTypedSelector(state => state.Location.itemPopupVisible);
  const [displayRemoveConfirmation, setDisplayRemoveConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const locItem: LocationItem | undefined = (result && result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);
  const [selectedTab, setSelectedTab] = useState<ClearLocationTarget>();

  const bottomSheetLocationDetailsModalRef = useRef<BottomSheetModal>(null);

  const managerSnapPoints = useMemo(() => ['30%'], []);
  const associateSnapPoints = useMemo(() => ['15%'], []);

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
        style={locationPopupVisible ? styles.disabledContainer : styles.container}
      >
        <LocationTabsNavigator
          dispatch={dispatch}
          floorItems={locItem?.items?.sectionItems ?? []}
          reserveItems={locItem?.pallets?.palletData ?? []}
          section={selectedSection}
          locationName={locationName}
          locationPopupVisible={locationPopupVisible}
          isManualScanEnabled={isManualScanEnabled}
          useEffectHook={useEffect}
          navigation={navigation}
          route={route}
          scannedEvent={scannedEvent}
          trackEventCall={trackEvent}
          validateSessionCall={validateSession}
          userFeatures={userFeatures}
          itemPopupVisible={itemPopupVisible}
          sectionResult={result}
          setSelectedTab={setSelectedTab}
          clearSectionApi={clearSectionApi}
          removeSectionApi={removeSectionApi}
          displayRemoveConfirmation={displayRemoveConfirmation}
          setDisplayRemoveConfirmation={setDisplayRemoveConfirmation}
          displayClearConfirmation={displayClearConfirmation}
          setDisplayClearConfirmation={setDisplayClearConfirmation}
          selectedTab={selectedTab}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetLocationDetailsModalRef}
        snapPoints={userFeatures.includes('manager approval') ? managerSnapPoints : associateSnapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetView>
          <BottomSheetClearCard
            onPress={() => {
              setDisplayClearConfirmation(true);
              dispatch(hideLocationPopup());
            }}
            text={strings('LOCATION.CLEAR_SECTION')}
            isManagerOption={false}
            isVisible={true}
          />
          <BottomSheetRemoveCard
            onPress={() => setDisplayRemoveConfirmation(true)}
            text={strings('LOCATION.REMOVE_SECTION')}
            isVisible={userFeatures.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default LocationTabs;
