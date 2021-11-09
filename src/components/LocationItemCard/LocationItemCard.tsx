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
import { setScannedEvent } from '../../state/actions/Global';

interface LocationItemCardProp {
  location: string
  locationId: number,
  locationType: LocationType,
  locationName: string,
  locationDetails: string,
  locationPopupVisible: boolean,
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
    locationPopupVisible,
    navigator,
    destinationScreen,
    dispatch
  } = props;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch(mapLocTypeToActionCreator[locationType](locationId, locationName));
        if (locationType === LocationType.SECTION) {
          dispatch(setScannedEvent({ type: 'sectionId', value: locationId.toString() }));
        }
        navigator.navigate(destinationScreen);
      }}
      disabled={locationPopupVisible}
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
