import React, {
  EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  ActivityIndicator, Text, TouchableOpacity, View
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import {
  BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView
} from '@gorhom/bottom-sheet';
import { Dispatch } from 'redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
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
import { resetScannedEvent, setScannedEvent } from '../../state/actions/Global';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { hideItemPopup, hideLocationPopup } from '../../state/actions/Location';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import BottomSheetRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import { setPrintingLocationLabels } from '../../state/actions/Print';
import { ClearLocationTarget, LocationName } from '../../models/Location';
import ReserveSectionDetails from '../../screens/SectionDetails/ReserveSectionDetails';
import ApiConfirmationModal from '../../screens/Modal/ApiConfirmationModal';
import { AsyncState } from '../../models/AsyncState';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { LocationIdName } from '../../state/reducers/Location';
import { GET_SECTION_DETAILS, REMOVE_SECTION } from '../../state/actions/asyncAPI';
import User from '../../models/User';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { cleanScanIfUpcOrEanBarcode } from '../../utils/barcodeUtils';

const Tab = createMaterialTopTabNavigator();
const LOCATION_EDIT_FLAG = 'location management edit';
const LOCATION_PALLETS = 'LOCATION.PALLETS';
const LOCATION_ITEMS = 'LOCATION.ITEMS';

export interface LocationProps {
    floorItems: SectionDetailsItem[];
    reserveItems: SectionDetailsPallet[];
    locationName: string;
    isManualScanEnabled: boolean;
    useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    route: RouteProp<any, string>;
    scannedEvent: { type: string | null; value: string | null };
    trackEventCall: (eventName: string, params?: any) => void;
    validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
    locationPopupVisible: boolean;
    user: User;
    itemPopupVisible:boolean;
    getSectionDetailsApi: AsyncState;
    clearSectionApi: AsyncState;
    setSelectedTab: React.Dispatch<React.SetStateAction<ClearLocationTarget | undefined>>;
    setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    removeSectionApi: AsyncState;
    displayRemoveConfirmation: boolean;
    setDisplayRemoveConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    section: LocationIdName;
    displayClearConfirmation: boolean;
    selectedTab: ClearLocationTarget | undefined;
    activityModal: boolean;
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
  target: ClearLocationTarget,
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setDisplayClearConfirmation(false);
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
  scannedEvent: { value: string | null; type: string | null },
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
): void => {
  validateSessionCall(navigation, route.name).then(() => {
    // Handles scanned event changes if the screen is in focus
    if (scannedEvent.value && navigation.isFocused()) {
      const searchValue = cleanScanIfUpcOrEanBarcode(scannedEvent);
      dispatch(getSectionDetails({ sectionId: searchValue }));
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
      // TODO refactor screen to put section details information into redux so we
      // need to clear only that for this part
      dispatch({ type: 'API/GET_SECTION_DETAILS/RESET' });
      dispatch(getSectionDetails({ sectionId: section.id.toString() }));
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: selectedTab === ClearLocationTarget.FLOOR
          ? strings('LOCATION.CLEAR_SECTION_SALES_FLOOR_SUCCEED')
          : strings('LOCATION.CLEAR_SECTION_RESERVE_SUCCEED'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }

    if (clearSectionApi.error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.CLEAR_SECTION_FAIL'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }
  }
};

export const removeSectionApiEffect = (
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  removeSectionApi: AsyncState,
  setDisplayRemoveConfirmation: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (navigation.isFocused()) {
    if (!removeSectionApi.isWaiting) {
      // on api success
      if (removeSectionApi.result) {
        setDisplayRemoveConfirmation(false);
        dispatch({ type: REMOVE_SECTION.RESET });
        dispatch(hideLocationPopup());
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: strings('LOCATION.SECTION_REMOVED'),
          visibilityTime: SNACKBAR_TIMEOUT
        });
        navigation.goBack();
      }

      // on api failure
      if (removeSectionApi.error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: strings('LOCATION.REMOVE_SECTION_FAIL'),
          visibilityTime: SNACKBAR_TIMEOUT
        });
      }
    }
  }
};

const activityModalEffect = (
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  activityModal: boolean,
  removeSectionApi: AsyncState,
  clearSectionApi: AsyncState
): void => {
  if (navigation.isFocused()) {
    if (!activityModal) {
      if (removeSectionApi.isWaiting || clearSectionApi.isWaiting) {
        dispatch(showActivityModal());
      }
    } else if (!removeSectionApi.isWaiting && !clearSectionApi.isWaiting) {
      dispatch(hideActivityModal());
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
          <TouchableOpacity
            onPress={isReserve ? () => addNewPallet() : () => addNewLocation()}
            disabled={isDisabled}
          >
            <View>
              <Text style={isDisabled ? styles.addTextDisabled : styles.addText}>
                {strings('GENERICS.ADD')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
};

const FloorDetailsList = (props: {sectionExists: boolean}) => {
  const user = useTypedSelector(state => state.User);
  const { sectionExists } = props;
  const locationManagementEdit = () => user.features.includes(LOCATION_EDIT_FLAG)
  || user.configs.locationManagementEdit;

  return (
    <>
      <TabHeader
        headerText={strings(LOCATION_ITEMS)}
        isEditEnabled={locationManagementEdit()}
        isReserve={false}
        isDisabled={!sectionExists}
      />
      <SectionDetails />
    </>
  );
};

const ReserveDetailsList = (props: {sectionExists: boolean}) => {
  const user = useTypedSelector(state => state.User);
  const { sectionExists } = props;
  const locationManagementEdit = () => user.features.includes(LOCATION_EDIT_FLAG)
    || user.configs.locationManagementEdit;

  return (
    <>
      <TabHeader
        headerText={strings(LOCATION_PALLETS)}
        isEditEnabled={locationManagementEdit()}
        isReserve={true}
        isDisabled={!sectionExists}
      />
      <ReserveSectionDetails />
    </>
  );
};
const getSectionDetailsLabel = (
  isWaiting: boolean,
  floorItems: SectionDetailsItem[],
  reserveItems: SectionDetailsPallet[]
): string => {
  const floorItemNbr = floorItems.length || 0;
  const reserveItemNbr = reserveItems.length || 0;
  if (isWaiting) {
    return `0 ${strings(LOCATION_ITEMS)}, 0 ${strings(LOCATION_PALLETS)}`;
  }
  return `${floorItemNbr} ${strings(LOCATION_ITEMS)}, ${reserveItemNbr} ${strings(LOCATION_PALLETS)}`;
};

const getLocationName = (isWaiting: boolean, sectionExists: boolean, newLocationName: string): string => {
  if (isWaiting || !sectionExists) {
    return `${strings('LOCATION.SECTION')} -`;
  }
  return `${strings('LOCATION.SECTION')} ${newLocationName}`;
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
    user,
    itemPopupVisible,
    getSectionDetailsApi,
    setSelectedTab,
    clearSectionApi,
    displayClearConfirmation,
    setDisplayClearConfirmation,
    removeSectionApi,
    displayRemoveConfirmation,
    setDisplayRemoveConfirmation,
    section,
    selectedTab,
    activityModal
  } = props;
  const sectionExists: boolean = (getSectionDetailsApi.result && getSectionDetailsApi.result.status !== 204);

  const locationManagementEdit = () => user.features.includes(LOCATION_EDIT_FLAG)
    || user.configs.locationManagementEdit;

  // Call Get Section Details on scan
  useEffectHook(() => getSectionDetailsEffect(
    validateSessionCall,
    route,
    scannedEvent,
    navigation,
    dispatch
  ), [navigation, scannedEvent]);

  useEffectHook(() => activityModalEffect(
    navigation, dispatch, activityModal, removeSectionApi, clearSectionApi
  ), [activityModal, removeSectionApi, clearSectionApi]);

  // Clear Section API
  useEffectHook(() => clearSectionApiEffect(
    dispatch, navigation, clearSectionApi,
    section, setDisplayClearConfirmation
  ), [clearSectionApi]);

  // Remove Section Api
  useEffectHook(() => removeSectionApiEffect(
    navigation, dispatch, removeSectionApi, setDisplayRemoveConfirmation
  ), [removeSectionApi]);

  // Call get section details on select from list
  // adjusted to work from loc management state instead of scanned
  useEffectHook(() => {
    navigation.addListener('focus', () => {
      validateSession(navigation, route.name).then(() => {
        if (!scannedEvent.value) {
          dispatch(getSectionDetails({ sectionId: section.id.toString() }));
        }
      });
    });
    navigation.addListener('blur', () => {
      dispatch(hideItemPopup());
      dispatch({ type: GET_SECTION_DETAILS.RESET });
      if (scannedEvent.value) {
        dispatch(resetScannedEvent());
      }
    });
    return () => {
      navigation.removeListener('focus', () => {});
      navigation.removeListener('blur', () => {});
    };
  }, [navigation, scannedEvent, section]);

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

  if (getSectionDetailsApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getSectionDetails(
              { sectionId: cleanScanIfUpcOrEanBarcode(scannedEvent) || section.id.toString() }
            ));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (getSectionDetailsApi.isWaiting || !getSectionDetailsApi.result) {
    return (
      <ActivityIndicator
        animating={true}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  const handleRemoveSection = () => {
    setDisplayRemoveConfirmation(false);
    dispatch(removeSection(section.id));
  };

  return (
    <>
      <ApiConfirmationModal
        api={removeSectionApi}
        handleConfirm={handleRemoveSection}
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
          && handleClearSection(dispatch, section.id, selectedTab, setDisplayClearConfirmation)}
        errorText={strings('LOCATION.CLEAR_SECTION_FAIL')}
      />
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={getLocationName(getSectionDetailsApi.isWaiting, sectionExists, locationName)}
        details={getSectionDetailsLabel(getSectionDetailsApi.isWaiting, floorItems, reserveItems)}
        buttonPress={() => {
          dispatch(setPrintingLocationLabels(LocationName.SECTION));
          navigation.navigate('PrintPriceSign');
        }}
        buttonText={locationManagementEdit() ? strings('LOCATION.PRINT_LABEL') : undefined}
        isDisabled={!sectionExists}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLOR.MAIN_THEME_COLOR,
          tabBarInactiveTintColor: COLOR.GREY_700,
          tabBarStyle: { backgroundColor: COLOR.WHITE },
          tabBarIndicatorStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          swipeEnabled: sectionExists
        }}
        initialRouteName={selectedTab === ClearLocationTarget.FLOOR ? 'FloorDetails' : 'ReserveDetails'}
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
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const clearSectionApi = useTypedSelector(state => state.async.clearLocation);
  const removeSectionApi = useTypedSelector(state => state.async.removeSection);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const user = useTypedSelector(state => state.User);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const itemPopupVisible = useTypedSelector(state => state.Location.itemPopupVisible);
  const activityModal = useTypedSelector(state => state.modal.showActivity);
  const [displayRemoveConfirmation, setDisplayRemoveConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const locItem: LocationItem | undefined = (getSectionDetailsApi.result && getSectionDetailsApi.result.data);
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);
  const [selectedTab, setSelectedTab] = useState<ClearLocationTarget>(ClearLocationTarget.FLOOR);

  const bottomSheetLocationDetailsModalRef = useRef<BottomSheetModal>(null);

  const managerSnapPoints = useMemo(() => ['40%'], []);
  const associateSnapPoints = useMemo(() => ['20%'], []);

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
        user={user}
        itemPopupVisible={itemPopupVisible}
        getSectionDetailsApi={getSectionDetailsApi}
        setSelectedTab={setSelectedTab}
        clearSectionApi={clearSectionApi}
        removeSectionApi={removeSectionApi}
        displayRemoveConfirmation={displayRemoveConfirmation}
        setDisplayRemoveConfirmation={setDisplayRemoveConfirmation}
        displayClearConfirmation={displayClearConfirmation}
        setDisplayClearConfirmation={setDisplayClearConfirmation}
        selectedTab={selectedTab}
        activityModal={activityModal}
      />
      <BottomSheetModal
        ref={bottomSheetLocationDetailsModalRef}
        snapPoints={user.features.includes('manager approval') ? managerSnapPoints : associateSnapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
        backdropComponent={BottomSheetBackdrop}
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
            isVisible={user.features.includes('manager approval')}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default LocationTabs;
