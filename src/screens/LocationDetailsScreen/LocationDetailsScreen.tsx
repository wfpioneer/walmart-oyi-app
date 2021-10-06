import React, { Dispatch } from 'react';
import {
  ActivityIndicator, Text, TouchableOpacity, View
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationItem } from '../../models/LocationItems';
import { getSectionDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import styles from './LocationDetailsScreen.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import FloorItemRow from '../../components/FloorItemRow/FloorItemRow';

interface LocationDetailProps {
  zoneName: string;
  aisleName: string;
  sectionName: string;
  getSectionDetailsApi: AsyncState;
  dispatch: Dispatch<any>;
  route: RouteProp<any, string>;
  trackEventCall: (eventName: string, params?: any) => void;
}

export const LocationDetailsScreen = (props: LocationDetailProps) : JSX.Element => {
  const {
    zoneName,
    aisleName,
    sectionName,
    getSectionDetailsApi,
    route,
    dispatch,
    trackEventCall
  } = props;

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
            dispatch(getSectionDetails({ sectionId: `${zoneName}${aisleName}-${sectionName}` }));
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
        renderItem={({ item }) => <FloorItemRow item={item} />} // TODO Swap between floor and reserve list component
        keyExtractor={(item, idx) => `${item.itemNbr}${idx}`}
      />
    </View>
  );
};

const LocationDetails = (): JSX.Element => {
  const sectionName = useTypedSelector(state => state.Location.selectedSection.name);
  const zoneName = useTypedSelector(state => state.Location.selectedZone.name);
  const aisleName = useTypedSelector(state => state.Location.selectedAisle.name);
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const route = useRoute();
  const dispatch = useDispatch();
  return (
    <>
      <LocationDetailsScreen
        zoneName={zoneName}
        aisleName={aisleName}
        sectionName={sectionName}
        getSectionDetailsApi={getSectionDetailsApi}
        dispatch={dispatch}
        route={route}
        trackEventCall={trackEvent}
      />
    </>
  );
};

export default LocationDetails;
