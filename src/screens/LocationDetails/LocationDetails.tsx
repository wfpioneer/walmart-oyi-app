import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, Text, View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import FAB from 'react-native-fab';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/buttons/Button';
import styles from './LocationDetails.style';
import LocationDetailsCard from '../../components/locationdetailscard/LocationDetailsCard';
import { strings } from '../../locales';
import Location from '../../models/Location';
import { COLOR } from '../../themes/Color';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  deleteLocationFromExisting, setFloorLocations, setReserveLocations
} from '../../state/actions/ItemDetailScreen';
import { deleteLocation } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { AsyncState } from '../../models/AsyncState';
import { DELETE_LOCATION, GET_LOCATION_DETAILS } from '../../state/actions/asyncAPI';
import { CustomModalComponent } from '../Modal/Modal';

interface LocationDetailsProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: any;
  floorLocations: Location[];
  reserveLocations: Location[];
  itemNbr: number;
  upcNbr: string;
  exceptionType: string | null | undefined;
  delAPI: AsyncState
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  locToConfirm: {
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
  };
  setLocToConfirm: React.Dispatch<React.SetStateAction<{
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
  }>>;
  locationsApi: AsyncState
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}
const getlocationsApiResult = (props: LocationDetailsProps, locationsApi: AsyncState) => {
  const {
    dispatch
  } = props;
  const locDetails = (locationsApi.result && locationsApi.result.data);
  if (locDetails.location) {
    if (locDetails.location.floor) {
      dispatch(setFloorLocations(locDetails.location.floor));
    }
    if (locDetails.location.reserve) {
      dispatch(setReserveLocations(locDetails.location.reserve));
    }
  }
};
export const LocationDetailsScreen = (props: LocationDetailsProps): JSX.Element => {
  const {
    delAPI,
    dispatch,
    displayConfirmation,
    floorLocations,
    reserveLocations,
    itemNbr,
    upcNbr,
    exceptionType,
    locToConfirm,
    locationsApi,
    navigation,
    route,
    setDisplayConfirmation,
    setLocToConfirm,
    useEffectHook
  } = props;

  // Navigation Listener
  useEffectHook(() => {
    // Resets location api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: GET_LOCATION_DETAILS.RESET });
      dispatch({ type: DELETE_LOCATION.RESET });
    });
  }, []);

  // Delete Location API
  useEffectHook(() => {
    // on api success
    if (!delAPI.isWaiting && delAPI.result) {
      dispatch(deleteLocationFromExisting(locToConfirm.locationArea, locToConfirm.locationIndex));
      setDisplayConfirmation(false);
    }
  }, [delAPI]);

  // Get Location Details API
  useEffectHook(() => {
    /* eslint-disable brace-style */
    // brace style ignored to allow comments to remain.
    // on api success
    if (!locationsApi.isWaiting && locationsApi.result) {
      getlocationsApiResult(props, locationsApi);
    }
  }, [locationsApi]);

  const handleEditLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('location_edit_location_click', { location: JSON.stringify(loc), index: locIndex });
      navigation.navigate('EditLocation', { currentLocation: loc, locIndex });
    }).catch(() => { });
  };

  const handleDeleteLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('location_delete_location_click', { location: JSON.stringify(loc), index: locIndex });
      setLocToConfirm({
        locationName: loc.locationName,
        locationArea: 'floor',
        locationIndex: locIndex,
        locationTypeNbr: loc.typeNbr
      });
      setDisplayConfirmation(true);
    }).catch(() => { });
  };

  const deleteConfirmed = () => {
    dispatch(
      deleteLocation({
        headers: { itemNbr: itemNbr },
        upc: upcNbr,
        sectionId: locToConfirm.locationName,
        locationTypeNbr: locToConfirm.locationTypeNbr
      }),
    );
  };

  const createLocations = (locationList: Location[]) => (
    <>
      {locationList.map((loc: Location, index: number) => (
        <LocationDetailsCard
          key={loc.locationName}
          locationName={loc.locationName}
          locationType={loc.type}
          editAction={() => handleEditLocation(loc, index)}
          deleteAction={() => handleDeleteLocation(loc, index)}
        />
      ))}
    </>
  );

  const addNewLocationNav = () => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('location_add_location_click');
      navigation.navigate('AddLocation');
    }).catch(() => { });
  };
  if (locationsApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={locationsApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }
  return (
    <>
      <CustomModalComponent
        isVisible={displayConfirmation}
        onClose={() => setDisplayConfirmation(false)}
        modalType="Error"
      >
        {delAPI.isWaiting ? (
          <ActivityIndicator
            animating={delAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
        ) : (
          <>
            <Text style={styles.message}>
              {delAPI.error
                ? strings('LOCATION.DELETE_LOCATION_API_ERROR')
                : `${strings('LOCATION.DELETE_CONFIRMATION')}${locToConfirm.locationName
                }`}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.delButton}
                title={strings('GENERICS.CANCEL')}
                backgroundColor={COLOR.TRACKER_RED}
                onPress={() => setDisplayConfirmation(false)}
              />
              <Button
                style={styles.delButton}
                title={delAPI.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={deleteConfirmed}
              />
            </View>
          </>
        )}
      </CustomModalComponent>
      <ScrollView>
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>
            {`${strings('LOCATION.FLOOR')} (${floorLocations.length})`}
          </Text>
        </View>
        {createLocations(floorLocations)}
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>
            {`${strings('LOCATION.RESERVE')} (${reserveLocations.length})`}
          </Text>
        </View>
        {createLocations(reserveLocations)}
      </ScrollView>
      <View style={styles.container}>
        <View style={styles.button}>
          <FAB
            buttonColor={COLOR.MAIN_THEME_COLOR}
            onClickAction={addNewLocationNav}
            visible={true}
            iconTextComponent={<MaterialCommunityIcon name="plus" size={40} color={COLOR.WHITE} />}
          />
        </View>
      </View>
    </>
  );
};

const LocationDetails = (): JSX.Element => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {
    floorLocations,
    reserveLocations,
    itemNbr,
    upcNbr,
    exceptionType
  } = useTypedSelector(state => state.ItemDetailScreen);
  const delAPI = useTypedSelector(state => state.async.deleteLocation);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '', locationArea: '', locationIndex: -1, locationTypeNbr: -1
  });
  const locations = useTypedSelector(state => state.async.getLocation);
  return (
    <LocationDetailsScreen
      delAPI={delAPI}
      dispatch={dispatch}
      displayConfirmation={displayConfirmation}
      floorLocations={floorLocations}
      reserveLocations={reserveLocations}
      itemNbr={itemNbr}
      upcNbr={upcNbr}
      exceptionType={exceptionType}
      locToConfirm={locToConfirm}
      locationsApi={locations}
      navigation={navigation}
      route={route}
      setDisplayConfirmation={setDisplayConfirmation}
      setLocToConfirm={setLocToConfirm}
      useEffectHook={useEffect}
    />
  );
};
export default LocationDetails;
