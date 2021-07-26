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

interface LocationItemCardProp {
  locationId: number,
  locationType: string,
  locationName: string,
  locationDetails : string,
  navigator: NavigationProp<any>,
  destinationScreen: string,
  dispatch: Dispatch<any>,
}

const updateTreeAndNavigate = (
  locationId: number,
  LocationName: string,
  locationType: string,
  destinationScreen: string,
  dispatch: Dispatch<any>,
  navigator: NavigationProp<any>
) => {
  if (locationType === 'Zones') {
    dispatch(selectZone(locationId, LocationName));
  }
  if (locationType === 'Aisles') {
    dispatch(selectAisle(locationId, LocationName));
  }
  if (locationType === 'Sections') {
    dispatch(selectSection(locationId, LocationName));
  }
  navigator.navigate(destinationScreen);
};

const LocationItemCard = (props: LocationItemCardProp) : JSX.Element => {
  const {
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
      onPress={() => updateTreeAndNavigate(locationId, locationName,
        locationType, destinationScreen, dispatch, navigator)}
    >
      <View style={styles.itemContainer}>
        <View style={styles.nameText}>
          <Text>{locationName}</Text>
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
