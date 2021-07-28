import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import styles from './AisleList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getAisle } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import { LocationType } from '../../models/LocationType';

const NoAisleMessage = () : JSX.Element => (
  <View style={styles.noAisles}>
    <Text>{strings('LOCATION.NO_AISLES_AVAILABLE')}</Text>
  </View>
);

interface AisleProps {
    zone: number,
    zoneName: string,
    getAllAisles: AsyncState,
    dispatch: Dispatch<any>,
    apiStart: number,
    setApiStart: React.Dispatch<React.SetStateAction<number>>,
    navigation: NavigationProp<any>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
}

export const AisleScreen = (props: AisleProps) : JSX.Element => {
  const {
    zone,
    zoneName,
    getAllAisles,
    navigation,
    apiStart,
    dispatch,
    setApiStart,
    route,
    useEffectHook,
    trackEventCall
  } = props;

  // calls to get all aisles
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setApiStart(moment().valueOf());
      dispatch(getAisle({ zoneId: zone }));
    }).catch(() => {});
  }), [navigation]);

  useEffectHook(() => {
    // on api success
    if (!getAllAisles.isWaiting && getAllAisles.result) {
      trackEventCall('get_aisles_success', { duration: moment().valueOf() - apiStart });
    }

    // on api failure
    if (!getAllAisles.isWaiting && getAllAisles.error) {
      trackEventCall('get_aisles_failure', {
        errorDetails: getAllAisles.error.message || getAllAisles.error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [getAllAisles]);

  if (getAllAisles.isWaiting) {
    return (
      <ActivityIndicator
        animating={getAllAisles.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getAllAisles.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getAisle({ zoneId: zone }));
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
        location={zoneName}
        details={`${getAllAisles.result?.data.length || 0} ${strings('LOCATION.AISLES')}`}
      />

      <FlatList
        data={getAllAisles.result?.data || []}
        renderItem={({ item }) => (
          <LocationItemCard
            locationId={item.aisleId}
            locationName={`${strings('LOCATION.AISLES')} ${item.aisleName}`}
            locationType={LocationType.AISLE}
            locationDetails={`${item.sectionCount} ${strings('LOCATION.SECTIONS')}`}
            navigator={navigation}
            destinationScreen={LocationType.SECTION}
            dispatch={dispatch}
          />
        )}
        keyExtractor={item => item.aisleName}
        ListEmptyComponent={<NoAisleMessage />}
        contentContainerStyle={styles.contentPadding}
      />
    </View>
  );
};

const AisleList = (): JSX.Element => {
  const navigation = useNavigation();
  const getLocationApi = useTypedSelector(state => state.async.getAisle);
  const zoneId = useTypedSelector(state => state.Location.selectedZone.id);
  const zoneName = useTypedSelector(state => state.Location.selectedZone.name);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();

  return (
    <AisleScreen
      zone={zoneId}
      zoneName={zoneName}
      navigation={navigation}
      dispatch={dispatch}
      getAllAisles={getLocationApi}
      apiStart={apiStart}
      setApiStart={setApiStart}
      route={route}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
    />
  );
};

export default AisleList;
