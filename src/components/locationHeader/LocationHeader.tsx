import React from 'react';
import {
  Text, View
} from 'react-native';
import styles from './LocationHeader.style';

interface LocationHeaderProps {
    location: string,
    details: string
}

export const LocationHeader = (props: LocationHeaderProps) : JSX.Element => {
  const { location, details } = props;
  return (
    <View style={styles.staticHeader}>
      <Text>
        {location}
      </Text>
      <Text style={styles.detailsText}>
        {details}
      </Text>
    </View>
  );
};

export default LocationHeader;
