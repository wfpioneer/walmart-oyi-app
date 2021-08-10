import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import styles from './LocationDetailsScreen.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { mockLocationDetails } from '../../mockData/locationDetails';
import { LocationType } from '../../models/LocationType';
import { LocationItem } from '../../models/LocationItems';

const NoAisleMessage = () : JSX.Element => (
  <View style={styles.noAisles}>
    <Text>{strings('LOCATION.NO_AISLES_AVAILABLE')}</Text>
  </View>
);

interface LocationDetailProps {
    sectionId: number,
    sectionName: string,
    mockData: LocationItem[]
    navigation: NavigationProp<any>
}

export const LocationDetailsScreen = (props: LocationDetailProps) : JSX.Element => {
  const {
    sectionId,
    sectionName,
    mockData,
    navigation
  } = props;

  return (
    <View>
      <LocationHeader
        location={sectionName}
        details={`${mockData.length} ${strings('LOCATION.ITEMS')}`}
      />
    </View>
  );
};

const LocationDetails = (): JSX.Element => {
  const sectionId = useTypedSelector(state => state.Location.selectedSection.id);
  const sectionName = useTypedSelector(state => state.Location.selectedSection.name);
  const navigation = useNavigation();

  return (
    <LocationDetailsScreen
      sectionId={sectionId}
      sectionName={sectionName}
      mockData={mockLocationDetails}
      navigation={navigation}
    />
  );
};

export default LocationDetails;
