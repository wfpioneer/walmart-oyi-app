import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import styles from './LocationItemCard.style';
import { COLOR } from '../../themes/Color';
import { selectAisle, selectSection, selectZone } from '../../state/actions/Location';
import { LocationType } from '../../models/LocationType';

interface LocationItemCardProp {
  location: string
  locationId: number,
  locationType: LocationType,
  locationName: string,
  locationDetails : string,
  navigator: NavigationProp<any>,
  destinationScreen: LocationType,
  dispatch: Dispatch<any>,
}

const mapLocTypeToActionCreator = {
  [LocationType.ZONE]: selectZone,
  [LocationType.AISLE]: selectAisle,
  [LocationType.SECTION]: selectSection
};

const LocationItemCard = (props: LocationItemCardProp) : JSX.Element => {
  const {
    location,
    locationId,
    locationType,
    locationName,
    locationDetails,
    navigator,
    destinationScreen,
    dispatch
  } = props;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        dispatch(mapLocTypeToActionCreator[locationType](locationId, locationName));
        navigator.navigate(destinationScreen);
      }}
    >
      <View style={styles.itemContainer}>
        <View style={styles.nameText}>
          <Text>{location}</Text>
          <View>
            <Text style={styles.detailsText}>
              {locationDetails}
            </Text>
          </View>
        </View>
        <View style={styles.arrowIcon}>
          <MaterialCommunityIcon name="chevron-right" size={20} color={COLOR.TIP_BLUE} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LocationItemCard;
