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
import { resetScannedEvent } from '../../state/actions/Global';
import { trackEvent } from '../../utils/AppCenterTool';

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
  trackEventCall: typeof trackEvent
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
    dispatch,
    trackEventCall
  } = props;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch(mapLocTypeToActionCreator[locationType](locationId, locationName));
        if (locationType === LocationType.SECTION) {
          dispatch(resetScannedEvent());
        }
        let screenName = '';
        if (locationType === LocationType.AISLE) {
          screenName = 'Aisle_List';
        } else if (locationType === LocationType.ZONE) {
          screenName = 'Zone_List';
        } else if (locationType === LocationType.SECTION) {
          screenName = 'Section_List';
        }
        trackEventCall(screenName, {
          action: 'location_item_card_clicked',
          locationName,
          destinationScreen
        });
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
