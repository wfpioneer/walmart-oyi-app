import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import styles from './SectionList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { LocationType } from '../../models/LocationType';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getSections } from '../../state/actions/saga';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';

const NoSectionMessage = () : JSX.Element => (
  <View style={styles.noSections}>
    <Text>{strings('LOCATION.NO_SECTIONS_AVAILABLE')}</Text>
  </View>
);

interface SectionProps {
    aisle: number,
    aisleName: string,
    getAllSections: AsyncState,
    dispatch: Dispatch<any>,
    apiStart: number,
    setApiStart: React.Dispatch<React.SetStateAction<number>>,
    navigation: NavigationProp<any>,
    route: RouteProp<any, string>,
    useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void,
    trackEventCall: (eventName: string, params?: any) => void,
}

export const SectionScreen = (props: SectionProps) : JSX.Element => {
  const {
    aisle,
    aisleName,
    getAllSections,
    navigation,
    apiStart,
    dispatch,
    setApiStart,
    route,
    useEffectHook,
    trackEventCall
  } = props;

  // calls to get all sections
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEventCall('get_location_api_call');
      setApiStart(moment().valueOf());
      dispatch(getSections({ aisleId: aisle }));
    }).catch(() => {});
  }), [navigation]);

  useEffectHook(() => {
  // on api success
    if (!getAllSections.isWaiting && getAllSections.result) {
      trackEventCall('get_sections_success', { duration: moment().valueOf() - apiStart });
    }

    // on api failure
    if (!getAllSections.isWaiting && getAllSections.error) {
      trackEventCall('get_sections_failure', {
        errorDetails: getAllSections.error.message || getAllSections.error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [getAllSections]);

  if (getAllSections.isWaiting) {
    return (
      <ActivityIndicator
        animating={getAllSections.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getAllSections.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getSections({ aisleId: aisle }));
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
        location={aisleName}
        details={`${getAllSections.result?.data.length || 0} ${strings('LOCATION.SECTIONS')}`}
      />

      <FlatList
        data={getAllSections.result?.data || []}
        renderItem={({ item }) => (
          <LocationItemCard
            locationId={item.sectionId}
            locationName={item.sectionName}
            locationType={LocationType.SECTION}
            dispatch={dispatch}
            locationDetails=""
            navigator={navigation}
            destinationScreen={LocationType.LOCATION_DETAILS}
          />
        )}
        keyExtractor={item => item.sectionName}
        ListEmptyComponent={<NoSectionMessage />}
        contentContainerStyle={styles.contentPadding}
      />
    </View>
  );
};

const SectionList = (): JSX.Element => {
  const navigation = useNavigation();
  const getLocationApi = useTypedSelector(state => state.async.getSections);
  const aisleId = useTypedSelector(state => state.Location.selectedAisle.id);
  const aisleName = useTypedSelector(state => state.Location.selectedZone.name);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();

  return (
    <SectionScreen
      aisle={aisleId}
      aisleName={aisleName}
      navigation={navigation}
      dispatch={dispatch}
      getAllSections={getLocationApi}
      apiStart={apiStart}
      setApiStart={setApiStart}
      route={route}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
    />
  );
};

export default SectionList;
