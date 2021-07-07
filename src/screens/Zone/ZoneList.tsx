import React, { EffectCallback, useEffect, useState } from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import moment from 'moment';
import styles from './ZoneList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import ZoneItemCard from '../../components/zoneItemCard/ZoneItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { getAllZones } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import { ZoneItem } from '../../models/ZoneItem';

const NoZonesMessage = () : JSX.Element => (
  <View style={styles.noZones}>
    <Text>{strings('LOCATION.NO_ZONES_AVAILABLE')}</Text>
  </View>
);

interface ZoneProps {
    siteId: number,
    dispatch: Dispatch<any>,
    getZoneApi: AsyncState,
    apiStart: number,
    setApiStart: React.Dispatch<React.SetStateAction<number>>,
    navigation: NavigationProp<any>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
}

export const ZoneScreen = (props: ZoneProps) : JSX.Element => {
  const {
    siteId,
    getZoneApi,
    apiStart,
    dispatch,
    setApiStart,
    navigation,
    route,
    useEffectHook,
    trackEventCall
  } = props;
  const [zoneItems, setZoneItems] = useState<ZoneItem[]>([]);

  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setApiStart(moment().valueOf());
      dispatch(getAllZones({}));
    }).catch(() => {});
  }), [navigation]);

  useEffectHook(() => {
    // on api success
    if (!getZoneApi.isWaiting && getZoneApi.result) {
      trackEventCall('get_location_api_success', { duration: moment().valueOf() - apiStart });
      setZoneItems(getZoneApi.result.data);
    }

    // on api failure
    if (!getZoneApi.isWaiting && getZoneApi.error) {
      trackEventCall('get_location_api_failure', {
        errorDetails: getZoneApi.error.message || getZoneApi.error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [getZoneApi]);

  return (
    <View>
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${siteId}`}
        details={`${zoneItems.length} ${strings('LOCATION.ZONES')}`}
      />

      <FlatList
        data={zoneItems}
        renderItem={({ item }) => (
          <ZoneItemCard
            zoneName={item.zoneName}
            aisleCount={item.aisleCount}
          />
        )}
        keyExtractor={item => item.zoneName}
        ListEmptyComponent={<NoZonesMessage />}
      />
    </View>
  );
};

const ZoneList = (): JSX.Element => {
  const siteId = useTypedSelector(state => state.User.siteId);
  const getLocationApi = useTypedSelector(state => state.async.getAllZones);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <ZoneScreen
      siteId={siteId}
      dispatch={dispatch}
      getZoneApi={getLocationApi}
      apiStart={apiStart}
      setApiStart={setApiStart}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
    />
  );
};

export default ZoneList;
