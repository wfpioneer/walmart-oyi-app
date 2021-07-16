import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import styles from './AisleList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import LocationItemCard from '../../components/LocationItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { AisleItem } from '../../models/LocationItem';
import { mockAisles } from '../../mockData/aisleDetails';

const NoAisleMessage = () : JSX.Element => (
  <View style={styles.noAisles}>
    <Text>{strings('LOCATION.NO_AISLES_AVAILABLE')}</Text>
  </View>
);

interface AisleProps {
    siteId: number,
    getMockData: AisleItem[],
    navigation: NavigationProp<any>
}

export const AisleScreen = (props: AisleProps) : JSX.Element => {
  const {
    siteId,
    getMockData,
    navigation
  } = props;

  return (
    <View>
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${siteId}`}
        details={`${getMockData.length} ${strings('LOCATION.AISLES')}`}
      />

      <FlatList
        data={getMockData}
        renderItem={({ item }) => (
          <LocationItemCard
            locationName={item.aisleName}
            locationDetails={`${item.sectionCount} ${strings('LOCATION.SECTIONS')}`}
            navigator={navigation}
            screenName="Sections"
          />
        )}
        keyExtractor={item => item.aisleName}
        ListEmptyComponent={<NoAisleMessage />}
      />
    </View>
  );
};

const AisleList = (): JSX.Element => {
  const siteId = useTypedSelector(state => state.User.siteId);
  const navigation = useNavigation();

  return (
    <AisleScreen
      siteId={siteId}
      getMockData={mockAisles}
      navigation={navigation}
    />
  );
};

export default AisleList;
