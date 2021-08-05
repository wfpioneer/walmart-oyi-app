import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import styles from './SectionList.style';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { SectionItem } from '../../models/LocationItems';
import { mockSections } from '../../mockData/sectionDetails';
import { LocationType } from '../../models/LocationType';

const NoSectionMessage = () : JSX.Element => (
  <View style={styles.noSections}>
    <Text>{strings('LOCATION.NO_SECTIONS_AVAILABLE')}</Text>
  </View>
);

interface SectionProps {
    getMockData: SectionItem[],
    dispatch: Dispatch<any>,
    navigation: NavigationProp<any>
}

export const SectionScreen = (props: SectionProps) : JSX.Element => {
  const {
    getMockData,
    dispatch,
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
            locationId={item.sectionId}
            locationName={item.sectionName}
            locationType={LocationType.SECTION}
            dispatch={dispatch}
            locationDetails=""
            navigator={navigation}
            destinationScreen={LocationType.LOCATION_DETAILS}
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
  const dispatch = useDispatch();

  return (
    <SectionScreen
      getMockData={mockSections}
      navigation={navigation}
      dispatch={dispatch}
    />
  );
};

export default SectionList;
