import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/buttons/Button';
import { useDispatch } from 'react-redux';
import FAB from 'react-native-fab';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './LocationDetails.style';
import LocationDetailsCard from '../../components/locationdetailscard/LocationDetailsCard';
import { strings } from '../../locales';
import Location from '../../models/Location';
import { COLOR } from '../../themes/Color';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { isUpdating, deleteLocationFromExisting } from '../../state/actions/Location';
import { deleteLocation } from '../../state/actions/saga';
import { State } from 'react-native-gesture-handler';

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
  const [deleting, setDeleting] = useState({locationArea: '', locationIndex: -1});
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
      dispatch(deleteLocationFromExisting(deleting.locationArea, deleting.locationIndex));
      setAPIInProgress(false);
      dispatch(isUpdating(true));
      console.log("needsUpdate status: " + needsUpdate);
      setDisplayConfirmation(false);
      return undefined;
    }

    // on api failure
    if (apiInProgress && delAPI.isWaiting === false && delAPI.error) {
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
    //setEditUpdateStarted(true);
    navigation.navigate('EditLocation', { currentLocation: loc, locIndex });
  };

  const handleDeleteLocation = (loc: Location, locIndex: number) => {
    setLocToConfirm({locationName: loc.locationName, locationArea: loc.type, locationIndex: locIndex, locationTypeNbr: loc.typeNbr})
    setDisplayConfirmation(true);
  }

  const deleteConfirmed = () => {
    dispatch(deleteLocation({upc: itemDetails.upcNbr, sectionId: locToConfirm.locationName, locationTypeNbr: locToConfirm.locationTypeNbr}));
    setDeleting({locationArea: locToConfirm.locationArea, locationIndex: locToConfirm.locationIndex});
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
        />))}
    </>
  );

  const addNewLocationNav = () => {
    navigation.navigate('AddLocation');
  };
  return (
    <>
      <Modal visible={displayConfirmation} transparent>
        <View style={styles.delConfirmation}>
          {delAPI.isWaiting?
          <ActivityIndicator
            animating={delAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />:
          <>
            <Text style={styles.message}>{error?strings('LOCATION.DELETE_LOCATION_API_ERROR'):`${strings('LOCATION.DELETE_CONFIRMATION')} ${locToConfirm.locationName}`}</Text>
            <View style={styles.buttonContainer}>
              <Button style={styles.delButton} title={strings('GENERICS.CANCEL')} backgroundColor={COLOR.TRACKER_RED}  onPress={ () => setDisplayConfirmation(false) }/>
              <Button style={styles.delButton} title={error?strings('GENERICS.RETRY'):strings('GENERICS.OK')} backgroundColor={COLOR.MAIN_THEME_COLOR} onPress={deleteConfirmed} />
            </View>
          </>
          }
        </View>
      </Modal>
      <ScrollView>
        {floorLocations ? (
          <View style={styles.sectionLabel}>
            <Text style={styles.labelText}>
              {`${strings('LOCATION.FLOOR')} (${floorLocations.length})`}
            </Text>
          </View>)
          : <View />}
        {floorLocations ? createLocations(floorLocations) : <View />}
        {reserveLocations ? (
          <View style={styles.sectionLabel}>
            <Text style={styles.labelText}>
              {`${strings('LOCATION.RESERVE')} (${reserveLocations.length})`}
            </Text>
          </View>)
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
