import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, Text, View
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
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
import { deleteLocationFromExisting, isUpdating } from '../../state/actions/Location';
import { deleteLocation } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';

const LocationDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const reserveLocations = useTypedSelector(state => state.Location.reserveLocations);
  const needsUpdate = useTypedSelector(state => state.Location.isUpdating);
  const itemDetails = useTypedSelector(state => state.Location.itemLocDetails);
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [error, setError] = useState(false);
  const delAPI = useTypedSelector(state => state.async.deleteLocation);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [locToConfirm, setLocToConfirm] = useState({
    locationName: '', locationArea: '', locationIndex: -1, locationTypeNbr: -1
  });

  useEffect(() => {
    if (needsUpdate) {
      dispatch(isUpdating(false));
    }
  }, [needsUpdate]);

  useEffect(() => {
    // on api success
    if (apiInProgress && delAPI.isWaiting === false && delAPI.result) {
      trackEvent('location_delete_location_api_success');
      dispatch(deleteLocationFromExisting(locToConfirm.locationArea, locToConfirm.locationIndex));
      setAPIInProgress(false);
      dispatch(isUpdating(true));
      setDisplayConfirmation(false);
      return undefined;
    }

    // on api failure
    if (apiInProgress && delAPI.isWaiting === false && delAPI.error) {
      trackEvent('location_delete_location_api_failure');
      setAPIInProgress(false);
      return setError(true);
    }

    // on api submission
    if (!apiInProgress && delAPI.isWaiting) {
      setError(false);
      return setAPIInProgress(true);
    }

    return undefined;
  }, [delAPI]);

  const handleEditLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation).then(() => {
      trackEvent('location_edit_location_click', { location: JSON.stringify(loc), index: locIndex });
      navigation.navigate('EditLocation', { currentLocation: loc, locIndex });
    }).catch(() => {});
  };

  const handleDeleteLocation = (loc: Location, locIndex: number) => {
    validateSession(navigation).then(() => {
      trackEvent('location_delete_location_click', { location: JSON.stringify(loc), index: locIndex });
      setLocToConfirm({
        locationName: loc.locationName, locationArea: 'floor', locationIndex: locIndex, locationTypeNbr: loc.typeNbr
      });
      setDisplayConfirmation(true);
    }).catch(() => {});
  };

  const deleteConfirmed = () => {
    trackEvent('location_delete_location_confirmed');
    dispatch(deleteLocation({
      upc: itemDetails.upcNbr, sectionId: locToConfirm.locationName, locationTypeNbr: locToConfirm.locationTypeNbr
    }));
  };

  const createLocations = (locationList: [Location]) => (
    <>
      {locationList.map((loc: Location, index: number) => (
        <LocationDetailsCard
          key={index}
          locationName={loc.locationName}
          locationType={loc.type}
          editAction={() => handleEditLocation(loc, index)}
          deleteAction={() => handleDeleteLocation(loc, index)}
        />
      ))}
    </>
  );

  const addNewLocationNav = () => {
    validateSession(navigation).then(() => {
      trackEvent('location_fab_button_click');
      navigation.navigate('AddLocation');
    }).catch(() => {});
  };
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
                {error
                  ? strings('LOCATION.DELETE_LOCATION_API_ERROR')
                  : `${strings('LOCATION.DELETE_CONFIRMATION')}${locToConfirm.locationName}`
                }
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
                  title={error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                  backgroundColor={COLOR.MAIN_THEME_COLOR}
                  onPress={deleteConfirmed}
                />
              </View>
            </>
          )
          }
        </View>
      </Modal>
      <ScrollView>
        {floorLocations ? (
          <View style={styles.sectionLabel}>
            <Text style={styles.labelText}>
              {`${strings('LOCATION.FLOOR')} (${floorLocations.length})`}
            </Text>
          </View>
        )
          : <View />}
        {floorLocations ? createLocations(floorLocations) : <View />}
        {reserveLocations ? (
          <View style={styles.sectionLabel}>
            <Text style={styles.labelText}>
              {`${strings('LOCATION.RESERVE')} (${reserveLocations.length})`}
            </Text>
          </View>
        )
          : <View />}
        {reserveLocations ? createLocations(reserveLocations) : <View />}
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
