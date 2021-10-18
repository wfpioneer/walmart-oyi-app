import React, { EffectCallback, useEffect } from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
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
import LocManualScanComponent from '../../components/LocationManualScan/LocationManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';

const NoZonesMessage = () : JSX.Element => (
  <View style={styles.noZones}>
    <Text>{strings('LOCATION.NO_ZONES_AVAILABLE')}</Text>
  </View>
);

interface ZoneProps {
    siteId: number,
    dispatch: Dispatch<any>,
    getZoneApi: AsyncState,
    isManualScanEnabled: boolean,
    navigation: NavigationProp<any>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
}

export const ZoneScreen = (props: ZoneProps) : JSX.Element => {
  const {
    siteId,
    getZoneApi,
    isManualScanEnabled,
    dispatch,
    navigation,
    route,
    useEffectHook,
    trackEventCall
  } = props;

  // calls the get all zone api
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
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
      {isManualScanEnabled && <LocManualScanComponent keyboardType="default" />}
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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <ZoneScreen
      siteId={siteId}
      dispatch={dispatch}
      getZoneApi={getZoneApi}
      isManualScanEnabled={isManualScanEnabled}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
    />
  );
};

export default ZoneList;
