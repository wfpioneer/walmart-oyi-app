import React, {
  EffectCallback,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import moment from 'moment';
import styles from './ZoneList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { getAllZones, getZoneNames } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { LocationType } from '../../models/LocationType';
import { CREATE_FLOW, ZoneItem } from '../../models/LocationItems';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import {
  hideLocationPopup,
  setAisles,
  setAislesToCreate,
  setCreateFlow,
  setPossibleZones,
  setZones
} from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import { CustomModalComponent } from '../Modal/Modal';
import Button from '../../components/buttons/Button';

const NoZonesMessage = (): JSX.Element => (
  <View style={styles.noZones}>
    <Text style={styles.noZonesText}>{strings('LOCATION.NO_ZONES_AVAILABLE')}</Text>
  </View>
);

interface ZoneProps {
  siteId: number,
  dispatch: Dispatch<any>,
  getZoneApi: AsyncState,
  getZoneNamesApi: AsyncState,
  isManualScanEnabled: boolean,
  navigation: NavigationProp<any>,
  apiStart: number,
  setApiStart: React.Dispatch<React.SetStateAction<number>>,
  errorVisible: boolean,
  setErrorVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  route: RouteProp<any, string>,
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void,
  trackEventCall: (eventName: string, params?: any) => void,
  locationPopupVisible: boolean
}
export const getZoneErrorModal = (
  errorVisible: boolean,
  setErrorVisible: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void
): JSX.Element => (
  <CustomModalComponent
    isVisible={errorVisible}
    onClose={() => setErrorVisible(false)}
    modalType="Error"
  >
    <MaterialCommunityIcon name="alert" size={30} color={COLOR.RED_500} style={styles.iconPosition} />
    <Text style={styles.errorText}>
      {strings('LOCATION.ZONE_NAME_ERROR')}
    </Text>
    <View style={styles.buttonContainer}>
      <Button
        testID="btnErrCancel"
        style={styles.modalButton}
        title={strings('GENERICS.CANCEL')}
        backgroundColor={COLOR.TRACKER_RED}
        onPress={() => {
          trackEventCall('Zone_List_Screen', { action: 'cancel_get_zones_error_modal_popup_click' });
          setErrorVisible(false);
        }}
      />
      <Button
        testID="btnErrRetry"
        style={styles.modalButton}
        title={strings('GENERICS.RETRY')}
        backgroundColor={COLOR.MAIN_THEME_COLOR}
        onPress={() => {
          trackEventCall('Zone_List_Screen', { action: 'get_zone_names_retry_click' });
          dispatch(getZoneNames());
        }}
      />
    </View>
  </CustomModalComponent>
);

export const getZoneApiEffectHook = (
  getZoneApi: AsyncState,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  apiStart: number
) => {
  // on api success
  if (!getZoneApi.isWaiting && getZoneApi.result) {
    dispatch(setZones(getZoneApi.result.data || []));
    setIsLoading(false);
  }

  // on api failure
  if (!getZoneApi.isWaiting && getZoneApi.error) {
    trackEventCall('Zone_List_Screen', {
      event: 'get_zones_failure',
      errorDetails: getZoneApi.error.message || getZoneApi.error,
      duration: moment().valueOf() - apiStart
    });
    setIsLoading(false);
  }

  // on api call
  if (getZoneApi.isWaiting) {
    setIsLoading(true);
  }
};

export const getZoneNamesApiEffectHook = (
  getZoneNamesApi: AsyncState,
  dispatch: Dispatch<any>,
  errorVisible: boolean,
  setErrorVisible: React.Dispatch<React.SetStateAction<boolean>>,
  navigation: NavigationProp<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // on api success
  if (!getZoneNamesApi.isWaiting && getZoneNamesApi.result) {
    dispatch(setPossibleZones(getZoneNamesApi.result.data));
    dispatch(setAisles([]));
    dispatch(setAislesToCreate(0));
    if (errorVisible) {
      setErrorVisible(false);
    }
    navigation.navigate('AddZone');
    // Delay loading indicator to prevent screen flicker on navigation.
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }

  // on api failure
  if (!getZoneNamesApi.isWaiting && getZoneNamesApi.error) {
    setIsLoading(false);
    // Alert Modal
    setErrorVisible(true);
  }

  // on api call
  if (getZoneNamesApi.isWaiting) {
    setIsLoading(true);
  }
};

export const ZoneScreen = (props: ZoneProps): JSX.Element => {
  const {
    siteId,
    getZoneApi,
    isManualScanEnabled,
    apiStart,
    setApiStart,
    dispatch,
    navigation,
    route,
    useEffectHook,
    trackEventCall,
    locationPopupVisible,
    getZoneNamesApi,
    errorVisible,
    setErrorVisible,
    isLoading,
    setIsLoading
  } = props;

  // calls the get all zone api
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('Zone_List_Screen', { action: 'get_zones_api_call' });
      setApiStart(moment().valueOf());
      dispatch(getAllZones());
    }).catch(() => { });
  }), [navigation]);

  // scanned event listener
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEventCall('Zone_List_Screen', { action: 'section_details_scan', value: scan.value, type: scan.type });
          dispatch(setScannedEvent(scan));
          dispatch(setManualScan(false));
          navigation.navigate('SectionDetails');
        });
      }
    });
    return () => {
      scanSubscription.remove();
    };
  }, []);
  // Get Zone Api
  useEffectHook(() => getZoneApiEffectHook(
    getZoneApi,
    dispatch,
    trackEventCall,
    setIsLoading,
    apiStart
  ), [getZoneApi]);
  // Get Zone Names Api
  useEffectHook(() => getZoneNamesApiEffectHook(
    getZoneNamesApi,
    dispatch,
    errorVisible,
    setErrorVisible,
    navigation,
    setIsLoading
  ), [getZoneNamesApi]);

  if (isLoading) {
    return (
      <ActivityIndicator
        animating={isLoading}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getZoneApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('Zone_List_Screen', { action: 'location_api_retry' });
            dispatch(getAllZones());
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const sortZone = (firstItem: ZoneItem, secondItem: ZoneItem) => {
    if (firstItem.zoneName < secondItem.zoneName) {
      return -1;
    }
    if (firstItem.zoneName > secondItem.zoneName) {
      return 1;
    }
    return 0;
  };

  const getZoneSorted = () => (getZoneApi.result && getZoneApi.result.data
    && Array.isArray(getZoneApi.result.data) ? getZoneApi.result?.data.sort(sortZone) : []);

  return (
    <View>
      {getZoneErrorModal(errorVisible, setErrorVisible, dispatch, trackEventCall)}
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${siteId}`}
        details={`${getZoneApi.result?.data.length || 0} ${strings('LOCATION.ZONES')}`}
      />
      <FlatList
        data={getZoneSorted()}
        renderItem={({ item }) => (
          <LocationItemCard
            location={item.zoneName}
            locationId={item.zoneId}
            locationType={LocationType.ZONE}
            locationName={item.zoneName}
            locationDetails={`${item.aisleCount} ${strings('LOCATION.AISLES')}`}
            navigator={navigation}
            destinationScreen={LocationType.AISLE}
            dispatch={dispatch}
            locationPopupVisible={locationPopupVisible}
            trackEventCall={trackEventCall}
          />
        )}
        keyExtractor={item => item.zoneName}
        ListEmptyComponent={<NoZonesMessage />}
        contentContainerStyle={styles.contentPadding}
      />
    </View>
  );
};

const ZoneList = (): JSX.Element => {
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const siteId = useTypedSelector(state => state.User.siteId);
  const getZoneApi = useTypedSelector(state => state.async.getAllZones);
  const getZoneNamesApi = useTypedSelector(state => state.async.getZoneNames);
  const location = useTypedSelector(state => state.Location);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [apiStart, setApiStart] = useState(0);
  const [errorVisible, setErrorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (location.locationPopupVisible) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [location]);

  const handleAddZone = () => {
    trackEvent('Zone_List_Screen', { action: 'add_zone_click' });
    dispatch(hideLocationPopup());
    bottomSheetModalRef.current?.dismiss();
    dispatch(setCreateFlow(CREATE_FLOW.CREATE_ZONE));
    dispatch(getZoneNames());
  };

  const renderBackdrop = useCallback(
    // eslint-disable-next-line no-shadow
    props => (
      <BottomSheetBackdrop
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <ZoneScreen
        siteId={siteId}
        dispatch={dispatch}
        getZoneApi={getZoneApi}
        isManualScanEnabled={isManualScanEnabled}
        navigation={navigation}
        route={route}
        useEffectHook={useEffect}
        apiStart={apiStart}
        setApiStart={setApiStart}
        trackEventCall={trackEvent}
        locationPopupVisible={location.locationPopupVisible}
        getZoneNamesApi={getZoneNamesApi}
        errorVisible={errorVisible}
        setErrorVisible={setErrorVisible}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <BottomSheetModal
        name="test"
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => {
          trackEvent('Zone_List_Screen', { action: 'hide_zone_bottom_sheet_modal' });
          dispatch(hideLocationPopup());
        }}
        style={styles.bottomSheetModal}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetAddCard
          isManagerOption={true}
          isVisible={true}
          text={strings('LOCATION.ADD_ZONE')}
          onPress={handleAddZone}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ZoneList;
