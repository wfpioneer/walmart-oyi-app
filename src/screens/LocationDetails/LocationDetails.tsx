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
import {ScrollView} from "react-native";
import {get} from 'lodash';


const LocationDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const reserveLocations = useTypedSelector(state => state.Location.reserveLocations);
  const handleEditLocation = (loc: Location) => {
    console.log(loc);
    navigation.navigate('EditLocation', {currentLocation: loc});
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
    navigation.navigate('AddLocation');
  };
  return (
    <>
      <ScrollView>

        {floorLocations ? <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>
            {strings('LOCATION.FLOOR')}
            {' '}
            (
            {floorLocations.length}
            )
          </Text>
        </View> : <View />}
        {floorLocations ? createLocations(floorLocations) : <View />}
        {reserveLocations ? <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>
            {strings('LOCATION.RESERVE')}
            {' '}
            (
            {reserveLocations.length}
            )
          </Text>
        </View> : <View />}
      {reserveLocations ? createLocations(reserveLocations) : <View />}
      </ScrollView>
      <View style={styles.container}>
        <View style={styles.button}>
          <FAB buttonColor={COLOR.MAIN_THEME_COLOR} onClickAction={addNewLocationNav} visible={true} iconTextComponent={<MaterialCommunityIcon name="plus" size={40} color={COLOR.WHITE} />} />
        </View>
      </View>
    </>
  );
};

export default LocationDetails;
