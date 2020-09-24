import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const LocationDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const reserveLocations = useTypedSelector(state => state.Location.reserveLocations);
  const needsUpdate = useTypedSelector(state => state.Location.isUpdating);

  useEffect(() => {
    if (needsUpdate) {
      dispatch(isUpdating(false));
    }
  }, [needsUpdate]);

  const handleEditLocation = (loc: Location, locIndex: number) => {
    //setEditUpdateStarted(true);
    navigation.navigate('EditLocation', { currentLocation: loc, locIndex });
  };

  const handleDeleteLocation = (locIndex: number) => {
    dispatch(deleteLocationFromExisting(locIndex));
  };

  const createLocations = (locationList: [Location]) => (
    <>
      {locationList.map((loc: Location, index: number) => (
        <LocationDetailsCard
          key={index}
          locationName={loc.locationName}
          locationType={loc.type}
          editAction={() => handleEditLocation(loc, index)}
          deleteAction={() => handleDeleteLocation(index)}
        />))}
    </>
  );

  const addNewLocationNav = () => {
    navigation.navigate('AddLocation');
  };
  return (
    <>
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
