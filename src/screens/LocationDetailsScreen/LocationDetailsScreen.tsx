import React, { Dispatch, EffectCallback, useEffect } from 'react';
import {
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { mockLocationDetails } from '../../mockData/locationDetails';
import { LocationItem } from '../../models/LocationItems';
import LocationTabs from '../../components/LocationTabs/LocationTabs';
import { getSectionDetails } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';

interface LocationDetailProps {
  zoneName: string;
  aisleName: string;
  sectionName: string;
  mockData: LocationItem;
  getSectionDetailsApi: AsyncState;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
}

export const LocationDetailsScreen = (props: LocationDetailProps) : JSX.Element => {
  const {
    zoneName,
    aisleName,
    sectionName,
    mockData,
    getSectionDetailsApi,
    navigation,
    route,
    dispatch,
    useEffectHook
  } = props;

  // Get Section Details
  useEffectHook(() => {
    validateSession(navigation, route.name).then(() => {
      dispatch(getSectionDetails({ sectionId: `${zoneName}${aisleName}-${sectionName}` }));
    }).catch(() => {});
  }, [navigation]);

  useEffectHook(() => {
    if (!getSectionDetailsApi.isWaiting && getSectionDetailsApi.result) {
      // Set new floor and reserve state
    }
  });
  const floor = mockData.floor.length;
  const reserve = mockData.reserve.length;

  return (
    <View>
      <LocationHeader
        location={`${strings('LOCATION.SECTION')} ${zoneName}${aisleName}-${sectionName}`}
        details={`${floor} ${strings('LOCATION.ITEMS')}, ${reserve} ${strings('LOCATION.PALLETS')}`}
      />
    </View>
  );
};

const LocationDetails = (): JSX.Element => {
  const sectionName = useTypedSelector(state => state.Location.selectedSection.name);
  const zoneName = useTypedSelector(state => state.Location.selectedZone.name);
  const aisleName = useTypedSelector(state => state.Location.selectedAisle.name);
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  return (
    <>
      <LocationDetailsScreen
        zoneName={zoneName}
        aisleName={aisleName}
        sectionName={sectionName}
        mockData={mockLocationDetails}
        getSectionDetailsApi={getSectionDetailsApi}
        dispatch={dispatch}
        navigation={navigation}
        route={route}
        useEffectHook={useEffect}
      />
      <LocationTabs
        mockData={mockLocationDetails}
      />
    </>
  );
};

export default LocationDetails;
