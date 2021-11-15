import React, {
  EffectCallback,
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
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import moment from 'moment';
import styles from './ZoneList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { getAllZones } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { LocationType } from '../../models/LocationType';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import { hideLocationPopup } from '../../state/actions/Location';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';

const NoZonesMessage = () : JSX.Element => (
  <View style={styles.noZones}>
    <Text style={styles.noZonesText}>{strings('LOCATION.NO_ZONES_AVAILABLE')}</Text>
  </View>
);

interface ZoneProps {
    siteId: number,
    dispatch: Dispatch<any>,
    getZoneApi: AsyncState,
    isManualScanEnabled: boolean,
    navigation: NavigationProp<any>,
    apiStart: number,
    setApiStart: React.Dispatch<React.SetStateAction<number>>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
    locationPopupVisible: boolean
}

export const ZoneScreen = (props: ZoneProps) : JSX.Element => {
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
    locationPopupVisible
  } = props;

  // calls the get all zone api
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_zones_api_call');
      setApiStart(moment().valueOf());
      dispatch(getAllZones());
    }).catch(() => {});
  }), [navigation]);

  // scanned event listener
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEventCall('section_details_scan', { value: scan.value, type: scan.type });
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
  useEffectHook(() => {
    // on api success
    if (!getZoneApi.isWaiting && getZoneApi.result) {
      trackEventCall('get_zones_success', { duration: moment().valueOf() - apiStart });
    }

    // on api failure
    if (!getZoneApi.isWaiting && getZoneApi.error) {
      trackEventCall('get_zones_failure', {
        errorDetails: getZoneApi.error.message || getZoneApi.error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [getZoneApi]);

  if (getZoneApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getZoneApi.isWaiting}
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
            trackEventCall('location_api_retry',);
            dispatch(getAllZones());
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${siteId}`}
        details={`${getZoneApi.result?.data.length || 0} ${strings('LOCATION.ZONES')}`}
      />
      <FlatList
        data={getZoneApi.result?.data || []}
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
  const location = useTypedSelector(state => state.Location);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [apiStart, setApiStart] = useState(0);
  const route = useRoute();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['22%', '50%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (location.locationPopupVisible) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [location]);

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideLocationPopup())}
        activeOpacity={1}
        disabled={!location.locationPopupVisible}
        style={styles.container}
      >
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
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(hideLocationPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetAddCard
          isManagerOption={true}
          isVisible={true}
          text={strings('LOCATION.ADD_AREA')}
          onPress={() => {}}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ZoneList;
