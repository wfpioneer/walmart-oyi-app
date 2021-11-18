import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { strings } from '../../locales';
import styles from './LocationHeader.style';
import { togglePrintScreen } from '../../state/actions/Print';

interface LocationHeaderProps {
  location: string;
  details: string;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>
}

export const LocationHeader = (props: LocationHeaderProps): JSX.Element => {
  const {
    location, details, navigation, route, dispatch
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
          onPress={() => {
            dispatch(togglePrintScreen(true));
            navigation.navigate('PrintPriceSign');
          }}
        >
          <Text style={styles.buttonLabelText}>{strings('PRINT.PRINT_LABEL')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LocationHeader;
