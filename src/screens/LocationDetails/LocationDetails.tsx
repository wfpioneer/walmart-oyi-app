import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FAB from 'react-native-fab';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './LocationDetails.style';
import LocationDetailsCard from '../../components/locationdetailscard/LocationDetailsCard';
import { strings } from '../../locales';
import Location from '../../models/Location';
import { COLOR } from '../../themes/Color';
import { useDispatch } from "react-redux";
import { useTypedSelector} from "../../state/reducers/RootReducer";
import { setCurrentLocation, toggleIsEditing } from "../../state/actions/Location";


export interface locationProps {
    floorLoc?: [Location];
    resLoc?: [Location];
  }

const LocationDetails = () => {
  const route = useRoute();
  const locProps: locationProps = route.params ? route.params : {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const locationState = useTypedSelector(state => state.Location);

  const handleEditLocation = (loc: Location) => {
    console.log(loc);
    dispatch(setCurrentLocation(loc));
    dispatch(toggleIsEditing());
    navigation.navigate('SelectLocationType', {editing: true, currentLocation: loc});
  };

  const handleDeleteLocation = (loc: Location) => {
    console.log(loc);
  };

  const createLocations = (locationList: [Location]) => {
    return (
      <>
        {locationList.map((loc: Location, index: number) => {
          return (
            <LocationDetailsCard key={index} locationName={`${loc.zoneName}${loc.aisleName}-${loc.sectionName}`}
                                 locationType={loc.type} editAction={(e) => handleEditLocation(loc)} deleteAction={(e) => handleDeleteLocation(loc)}/>
          );
        })}
      </>
    );
  };
  const addNewLocationNav = () => {
    navigation.navigate('SelectLocationType');
  };
  return (
    <>
      {locProps.floorLoc ? (
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>
            {strings('LOCATION.FLOOR')}
            {' '}
            (
            {locProps.floorLoc.length}
            )
          </Text>
        </View>
      ) : <View />}
      {locProps.floorLoc ? createLocations(locProps.floorLoc) : <View />}
      {locProps.resLoc ? (
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>
            {strings('LOCATION.RESERVE')}
            {' '}
            (
            {locProps.resLoc.length}
            )
          </Text>
        </View>
      ) : <View />}
      {locProps.resLoc ? createLocations(locProps.resLoc) : <View />}
      <View style={styles.container}>
        <View style={styles.button}>
          <FAB buttonColor={COLOR.MAIN_THEME_COLOR} onClickAction={addNewLocationNav} visible={true} iconTextComponent={<MaterialCommunityIcon name="plus" size={40} color={COLOR.WHITE} />} />
        </View>
      </View>
    </>
  );
};

export default LocationDetails;
