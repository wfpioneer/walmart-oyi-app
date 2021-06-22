import React from 'react';
import {
  Text, View
} from 'react-native';
import styles from './LocationHeader.style';

interface LocationHeaderProps {
title: string,
details: string
}

export const LocationHeader = (props: LocationHeaderProps) : JSX.Element => {
  const { title, details } = props;
  return (
    <View style={styles.staticHeader}>
      <Text>
        {title}
      </Text>
      <Text style={styles.areas}>
        {details}
      </Text>
    </View>
  );
};

export default LocationHeader;
