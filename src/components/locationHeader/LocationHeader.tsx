import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { strings } from '../../locales';
import styles from './LocationHeader.style';

interface LocationHeaderProps {
  location: string;
  details: string;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
}

export const LocationHeader = (props: LocationHeaderProps): JSX.Element => {
  const {
    location, details, navigation, route
  } = props;
  // Temp change to navigate to PrintScreen
  return (
    <View style={styles.staticHeader}>
      <View>
        <Text>{location}</Text>
        <Text style={styles.detailsText}>{details}</Text>
      </View>
      {route.name === 'SectionDetails' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('PrintLabel')}
        >
          <Text style={styles.buttonLabelText}>{strings('PRINT.PRINT_LABEL')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LocationHeader;
