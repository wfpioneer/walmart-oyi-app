import React, { Dispatch, EffectCallback, useEffect } from 'react';
import {
  ActivityIndicator, Text, TouchableOpacity, View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationItem } from '../../models/LocationItems';
import { getSectionDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import styles from './SectionDetailsScreen.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import FloorItemRow from '../../components/FloorItemRow/FloorItemRow';
import { GET_SECTION_DETAILS } from '../../state/actions/asyncAPI';
import { selectAisle, selectSection, selectZone } from '../../state/actions/Location';
import ReservePalletRow from '../../components/ReservePalletRow/ReservePalletRow';

interface SectionDetailsProps {
  getSectionDetailsApi: AsyncState;
  dispatch: Dispatch<any>;
  route: RouteProp<any, string>;
  navigation: NavigationProp<any>;
  trackEventCall: (eventName: string, params?: any) => void;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  scannedEvent: {type: string, value: string};
  addAPI: AsyncState;
}

export const SectionDetailsScreen = (props: SectionDetailsProps) : JSX.Element => {
  const {
    getSectionDetailsApi,
    route,
    dispatch,
    navigation,
    trackEventCall,
    useEffectHook,
    scannedEvent,
    addAPI
  } = props;

  // Navigation Listener
  useEffectHook(() => {
    // Resets Get SectionDetails api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: GET_SECTION_DETAILS.RESET });
    });
  }, []);

  // Get Section Details Api
  useEffectHook(() => {
    // on api success
    if (!getSectionDetailsApi.isWaiting && getSectionDetailsApi.result) {
      // Update Location State on Success
      if (getSectionDetailsApi.result.status === 200) {
        const { zone, aisle, section } = getSectionDetailsApi.result.data;
        dispatch(selectZone(zone.id, zone.name));
        dispatch(selectAisle(aisle.id, aisle.name));
        dispatch(selectSection(section.id, section.name));
      }
    }
  });
  const locationItem: LocationItem | undefined = (getSectionDetailsApi.result && getSectionDetailsApi.result.data);

  if (getSectionDetailsApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getSectionDetailsApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getSectionDetailsApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.locDetailsScreenContainer}>
      <FlatList
        data={route.name === 'FloorDetails' ? locationItem?.floor : locationItem?.reserve}
        renderItem={({ item }) => (
          route.name === 'FloorDetails' ? <FloorItemRow item={item} /> : <ReservePalletRow reservePallet={item} />
        )}
        keyExtractor={(item, idx) => `${item.itemNbr}${idx}`}
      />
    </View>
  );
};

const SectionDetails = (): JSX.Element => {
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const addAPI = useTypedSelector(state => state.async.addPallet);
  return (
    <>
      <SectionDetailsScreen
        getSectionDetailsApi={getSectionDetailsApi}
        addAPI={addAPI}
        dispatch={dispatch}
        navigation={navigation}
        route={route}
        trackEventCall={trackEvent}
        useEffectHook={useEffect}
        scannedEvent={scannedEvent}
      />
    </>
  );
};

export default SectionDetails;
