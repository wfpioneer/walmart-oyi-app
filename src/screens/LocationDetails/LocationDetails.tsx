import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, Text, View
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation, useRoute } from '@react-navigation/native';
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
} from '../../state/actions/Location';
import { deleteLocation } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';

interface LocationDetailsProps {
  navigation: any;
  route: any;
  dispatch: any;
  floorLocations: Location[];
  reserveLocations: Location[];
  itemDetails: {
    itemNbr: number;
    upcNbr: string;
    exceptionType: string;
  };
  apiInProgress: boolean;
  setAPIInProgress: Function;
  apiError: boolean;
  setApiError: Function;
  delAPI: {
    isWaiting: boolean;
    value: any;
    error: any;
    result: any;
  };
  displayConfirmation: boolean;
  setDisplayConfirmation: Function;
  locToConfirm: {
    locationName: string;
    locationArea: string;
    locationIndex: number;
    locationTypeNbr: number;
  };
  setLocToConfirm: Function;
  locationsApi: {
    isWaiting: boolean;
    value: any;
    error: any;
    result: any;
  };
  useEffectHook: Function;
}
const LocationDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const reserveLocations = useTypedSelector(state => state.Location.reserveLocations);
  const itemDetails = useTypedSelector(state => state.Location.itemLocDetails);
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [apiError, setApiError] = useState(false);
  const delAPI = useTypedSelector(state => state.async.deleteLocation);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '', locationArea: '', locationIndex: -1, locationTypeNbr: -1
  });
  const locations = useTypedSelector(state => state.async.getLocation);
  return (
    <LocationDetailsScreen
      apiInProgress={apiInProgress}
      delAPI={delAPI}
      dispatch={dispatch}
      displayConfirmation={displayConfirmation}
      apiError={apiError}
      floorLocations={floorLocations}
      reserveLocations={reserveLocations}
      itemDetails={itemDetails}
      locToConfirm={locToConfirm}
      locationsApi={locations}
      navigation={navigation}
      route={route}
      setAPIInProgress={setAPIInProgress}
      setDisplayConfirmation={setDisplayConfirmation}
      setApiError={setApiError}
      setLocToConfirm={setLocToConfirm}
      useEffectHook={useEffect}
    />
  );
};

export const LocationDetailsScreen = (props: LocationDetailsProps) => {
  const {
    apiInProgress,
    delAPI,
    dispatch,
    displayConfirmation,
    apiError,
    floorLocations,
    reserveLocations,
    itemDetails,
    locToConfirm,
    locationsApi,
    navigation,
    route,
    setAPIInProgress,
    setDisplayConfirmation,
    setApiError,
    setLocToConfirm,
    useEffectHook
  } = props;

  // Delete Location API
  useEffectHook(() => {
    // on api success
    if (apiInProgress && delAPI.isWaiting === false && delAPI.result) {
      trackEvent('location_delete_location_api_success');
      dispatch(deleteLocationFromExisting(locToConfirm.locationArea, locToConfirm.locationIndex));
      setAPIInProgress(false);
      setDisplayConfirmation(false);
    }

    // on api failure
    if (apiInProgress && delAPI.isWaiting === false && delAPI.error) {
      trackEvent('location_delete_location_api_failure', {
        upcNbr: delAPI.value.upc,
        sectionId: delAPI.value.sectionId,
        errorDetails: delAPI.error.message || delAPI.error
      });
      setAPIInProgress(false);
      setApiError(true);
    }

    // on api submission
    if (!apiInProgress && delAPI.isWaiting) {
      setApiError(false);
      setAPIInProgress(true);
    }
  }, [delAPI]);

  // Get Location Details API
  useEffectHook(() => {
    /* eslint-disable brace-style */
    // brace style ignored to allow comments to remain.
    // on api success
    if (apiInProgress && locationsApi.isWaiting === false && locationsApi.result) {
      const locDetails = (locationsApi.result && locationsApi.result.data);
      trackEvent('location_get_location_api_success');
      if (locDetails.location) {
        if (locDetails.location.floor) dispatch(setFloorLocations(locDetails.location.floor));
        if (locDetails.location.reserve) dispatch(setReserveLocations(locDetails.location.reserve));
      }
      setAPIInProgress(false);
    }
    // on api failure
    else if (apiInProgress && locationsApi.isWaiting === false && locationsApi.error) {
      trackEvent('location_get_location_api_failure', {
        itemNbr: itemDetails.itemNbr,
        upcNbr: itemDetails.upcNbr,
        errorDetails: locationsApi.error.message || locationsApi.error
      });
      setAPIInProgress(false);
      setApiError(true);
    }
    // on api submission
    else if (!apiInProgress && locationsApi.isWaiting) {
      trackEvent('location_get_location_api_start');
      setApiError(false);
      setAPIInProgress(true);
    }
  }, [locationsApi]);

  const handleEditLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('location_edit_location_click', { location: JSON.stringify(loc), index: locIndex });
      navigation.navigate('EditLocation', { currentLocation: loc, locIndex });
    }).catch(() => {});
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
    }).catch(() => {});
  };

  const deleteConfirmed = () => {
    trackEvent('location_delete_location_confirmed');
    dispatch(
      deleteLocation({
        upc: itemDetails.upcNbr,
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
      trackEvent('location_fab_button_click');
      navigation.navigate('AddLocation');
    }).catch(() => {});
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
      <Modal isVisible={displayConfirmation}>
        <View style={styles.delConfirmation}>
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
                {apiError
                  ? strings('LOCATION.DELETE_LOCATION_API_ERROR')
                  : `${strings('LOCATION.DELETE_CONFIRMATION')}${
                    locToConfirm.locationName
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
                  title={apiError ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                  backgroundColor={COLOR.MAIN_THEME_COLOR}
                  onPress={deleteConfirmed}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
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

export default LocationDetails;
