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
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';
import { strings } from '../../locales';
import { LocationItem, SectionDetailsItem, SectionDetailsPallet } from '../../models/LocationItems';
import { COLOR } from '../../themes/Color';
import styles from './LocationTabNavigator.style';
import LocationHeader from '../../components/locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import {
  clearLocation, getPalletDetails, getSectionDetails, removeSection
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
import { CustomModalComponent } from '../../screens/Modal/Modal';
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
    clearSectionApiStart: number;
    setClearSectionApiStart: React.Dispatch<React.SetStateAction<number>>;
    setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
    setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    trackApiEvent: (eventName: string, params: any) => void
    removeSectionApi: AsyncState;
    displayConfirmation: boolean;
    setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    section: LocationIdName
}

interface TabHeaderProps {
    headerText: string;
    isEditEnabled: boolean;
    isReserve: boolean;
    isDisabled: boolean;
}

export const handleModalClose = (
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  setClearSectionApiStart: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>
): void => {
  setDisplayConfirmation(false);
  setClearSectionApiStart(0);
  dispatch({ type: 'API/CLEAR_SECTION/RESET' });
};

export const clearSectionApiEffect = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  clearSectionApi: AsyncState,
  clearSectionApiStart: number,
  setClearSectionApiStart: React.Dispatch<React.SetStateAction<number>>,
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  trackApiEvent: (eventName: string, params?: any) => void
): void => {
  if (navigation.isFocused() && !clearSectionApi.isWaiting) {
    if (clearSectionApi.result) {
      // Success
      trackApiEvent('delete_zone_success', {
        duration: moment().valueOf() - clearSectionApiStart
      });
      handleModalClose(setDisplayConfirmation, setClearSectionApiStart, dispatch);
      navigation.goBack();
    }

    if (clearSectionApi.error) {
      // Failure
      trackApiEvent('delete_zone_fail', {
        duration: moment().valueOf() - clearSectionApiStart,
        reason: clearSectionApi.error.message || clearSectionApi.error.toString()
      });
      dispatch(showSnackBar(strings('LOCATION.REMOVE_ZONE_FAIL'), 3000));
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
  const navigation = useNavigation();
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const dispatch = useDispatch();
  const { sectionExists } = props;

  let palletIds: number[] = [];
  // Call Get Pallet Details API
  useEffect(() => navigation.addListener('focus', () => {
    // Call if SectionDetails returned successfully and tab is in focus
    if (!getSectionDetailsApi.isWaiting && getSectionDetailsApi.result) {
      if (getSectionDetailsApi.result.status !== 204) {
        const { pallets } = getSectionDetailsApi.result.data;
        if (pallets.palletData.length !== 0) {
          palletIds = pallets.palletData.map(
            (item: Omit<SectionDetailsPallet, 'items'>) => item.palletId
          );
          dispatch(getPalletDetails({ palletIds }));
        }
      }
    }
  }), [getSectionDetailsApi]);

  return (
    <>
      <TabHeader
        headerText={strings('LOCATION.PALLETS')}
        isEditEnabled={userFeatures.includes('location management edit')}
        isReserve={true}
        isDisabled={!sectionExists}
      />
      <ReserveSectionDetails palletIds={palletIds} />
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
    clearSectionApiStart,
    setClearSectionApiStart,
    setDisplayClearConfirmation,
    trackApiEvent,
    removeSectionApi,
    displayConfirmation,
    setDisplayConfirmation,
    section
  } = props;
  const sectionExists: boolean = (sectionResult && sectionResult.status !== 204);

  // Call Get Section Details
  useEffectHook(() => {
    validateSessionCall(navigation, route.name).then(() => {
      // Handles scanned event changes if the screen is in focus
      if (scannedEvent.value && navigation.isFocused()) {
        dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
        navigation.navigate('FloorDetails');
      }
    }).catch(() => {});
  }, [navigation, scannedEvent]);

  // Clear Section API
  useEffectHook(() => clearSectionApiEffect(
    dispatch,
    navigation,
    clearSectionApi,
    clearSectionApiStart,
    setClearSectionApiStart,
    setDisplayClearConfirmation,
    trackApiEvent
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
      setDisplayConfirmation(false);
      dispatch({ type: REMOVE_SECTION.RESET });
      dispatch(hideLocationPopup());
      navigation.goBack();
    }
  });

  const removeSectionModal = () => (
    <CustomModalComponent
      isVisible={displayConfirmation}
      onClose={() => setDisplayConfirmation(false)}
      modalType="Error"
    >
      {removeSectionApi.isWaiting ? (
        <ActivityIndicator
          animating={removeSectionApi.isWaiting}
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
          <View style={styles.confirmationView}>
            <Text style={styles.confirmationText}>
              {`${strings('LOCATION.REMOVE_SECTION_CONFIRMATION', { sectionName: locationName })}`}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.delButton}
              title={strings('GENERICS.CANCEL')}
              backgroundColor={COLOR.TRACKER_RED}
              onPress={() => setDisplayConfirmation(false)}
            />
            <Button
              style={styles.delButton}
              title={removeSectionApi.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
              backgroundColor={COLOR.MAIN_THEME_COLOR}
              onPress={() => dispatch(removeSection(section.id))}
            />
          </View>
        </>
      )}
    </CustomModalComponent>
  );
  return (
    <>
      {removeSectionModal()}
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
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const locItem: LocationItem | undefined = (result && result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [clearSectionApiStart, setClearSectionApiStart] = useState(0);

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

  const handleClearSection = () => {
    setClearSectionApiStart(moment().valueOf());
    dispatch(clearLocation({ locationId: selectedSection.id, target: selectedTab }));
  };

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
          clearSectionApiStart={clearSectionApiStart}
          setClearSectionApiStart={setClearSectionApiStart}
          setDisplayClearConfirmation={setDisplayClearConfirmation}
          trackApiEvent={trackEvent}
          removeSectionApi={removeSectionApi}
          displayConfirmation={displayConfirmation}
          setDisplayConfirmation={setDisplayConfirmation}
        />
      </TouchableOpacity>
      <ApiConfirmationModal
        isVisible={displayClearConfirmation}
        onClose={() => handleModalClose(setDisplayClearConfirmation, setClearSectionApiStart, dispatch)}
        api={clearSectionApi}
        mainText={strings('LOCATION.CLEAR_SECTION_CONFIRMATION')}
        subtext1={selectedTab === ClearLocationTarget.FLOOR
          ? strings('LOCATION.CLEAR_SECTION_SALES_FLOOR_MESSAGE')
          : strings('LOCATION.CLEAR_SECTION_RESERVE_MESSAGE')}
        subtext2={strings('LOCATION.CLEAR_SECTION_WONT_DELETE')}
        handleConfirm={() => handleClearSection()}
      />
      <BottomSheetModal
        ref={bottomSheetLocationDetailsModalRef}
        snapPoints={userFeatures.includes('manager approval') ? managerSnapPoints : associateSnapPoints}
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
            onPress={() => setDisplayConfirmation(true)}
            text={strings('LOCATION.REMOVE_SECTION')}
            isVisible={userFeatures.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default LocationTabs;
