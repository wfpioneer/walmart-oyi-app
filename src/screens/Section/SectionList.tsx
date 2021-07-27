import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import styles from './SectionList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { SectionItem } from '../../models/LocationItems';
import { mockSections } from '../../mockData/sectionDetails';

const NoSectionMessage = () : JSX.Element => (
  <View style={styles.noSections}>
    <Text>{strings('LOCATION.NO_SECTIONS_AVAILABLE')}</Text>
  </View>
);

interface SectionProps {
    getMockData: SectionItem[],
    navigation: NavigationProp<any>
}

export const SectionScreen = (props: SectionProps) : JSX.Element => {
  const {
    getMockData,
    navigation
  } = props;

  return (
    <View>
      <LocationHeader
        location="Aisle 1"
        details={`${getMockData.length} ${strings('LOCATION.SECTIONS')}`}
      />

      <FlatList
        data={getMockData}
        renderItem={({ item }) => (
          <LocationItemCard
            locationName={item.sectionName}
            locationDetails=""
            navigator={navigation}
            destinationScreen=""
          />
        )}
        keyExtractor={item => item.sectionName}
        ListEmptyComponent={<NoSectionMessage />}
      />
    </View>
  );
};

const SectionList = (): JSX.Element => {
  const navigation = useNavigation();

  return (
    <SectionScreen
      getMockData={mockSections}
      navigation={navigation}
    />
  );
};

export default SectionList;
