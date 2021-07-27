import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp
} from '@react-navigation/native';
import styles from './LocationItemCard.style';
import { COLOR } from '../../themes/Color';

interface LocationItemCardProp {
  locationName: string,
  locationDetails : string,
  navigator: NavigationProp<any>,
  destinationScreen: string
}

const LocationItemCard = (props: LocationItemCardProp) : JSX.Element => {
  const {
    locationName,
    locationDetails,
    navigator,
    destinationScreen
  } = props;
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => ((destinationScreen === null) ? navigator.navigate(destinationScreen) : destinationScreen)}
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
