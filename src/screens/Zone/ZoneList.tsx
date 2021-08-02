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

const NoZonesMessage = () : JSX.Element => (
  <View style={styles.noZones}>
    <Text>{strings('LOCATION.NO_ZONES_AVAILABLE')}</Text>
  </View>
);

interface ZoneProps {
    siteId: number,
    dispatch: Dispatch<any>,
    getZoneApi: AsyncState,
    navigation: NavigationProp<any>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
}

export const ZoneScreen = (props: ZoneProps) : JSX.Element => {
  const {
    siteId,
    getZoneApi,
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
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${siteId}`}
        details={`${getZoneApi.result?.data.length || 0} ${strings('LOCATION.ZONES')}`}
      />

      <FlatList
        data={getZoneApi.result?.data || []}
        renderItem={({ item }) => (
          <LocationItemCard
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
  const siteId = useTypedSelector(state => state.User.siteId);
  const getLocationApi = useTypedSelector(state => state.async.getAllZones);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <ZoneScreen
      siteId={siteId}
      dispatch={dispatch}
      getZoneApi={getLocationApi}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
    />
  );
};

export default ZoneList;
