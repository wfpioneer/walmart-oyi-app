import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './LocationHeader.style';

interface LocationHeaderProps {
  location: string,
  details: string,
  buttonText?: string,
  buttonPress?: () => void,
  isDisabled?: boolean
}

export const LocationHeader = (props: LocationHeaderProps) : JSX.Element => {
  const {
    location, details, buttonText, buttonPress, isDisabled
  } = props;

  const buttonView = () => (buttonText ? (
    <TouchableOpacity onPress={buttonPress} disabled={isDisabled}>
      <Text style={isDisabled ? styles.disabledButton : styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  ) : null);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerText}>
        <Text>
          {location}
        </Text>
        <Text style={styles.detailsText}>
          {details}
        </Text>
      </View>
      {buttonView()}
    </View>
  );
};

LocationHeader.defaultProps = {
  buttonText: undefined,
  buttonPress: undefined,
  isDisabled: false
};

export default LocationHeader;
