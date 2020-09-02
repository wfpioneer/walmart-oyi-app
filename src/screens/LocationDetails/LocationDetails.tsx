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


export interface locationProps {
    floorLoc?: [Location];
    resLoc?: [Location];
  };

function LocationDetails() {
  const route = useRoute();
  const locProps: locationProps = route.params ? route.params : {};
  const navigation = useNavigation();
  function createLocations(locationList: [Location]) {
    return (
      <>
        {locationList.map(cardMaker)}
      </>
    );
  };
  function cardMaker(loc: Location) {
    return (
      <LocationDetailsCard locationName={loc.name} locationType={loc.type} />
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
