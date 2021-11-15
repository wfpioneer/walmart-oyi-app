import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLOR from '../../themes/Color';
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
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <View style={styles.staticHeader}>
        <Text>{location}</Text>
        <Text style={styles.detailsText}>{details}</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
        {route.name === 'SectionDetails' && (
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', paddingRight: 20 }}
            onPress={() => navigation.navigate('PrintLabel')}
          >
            <Text> Print Label</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default LocationHeader;
