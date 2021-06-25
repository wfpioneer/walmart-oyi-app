import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import styles from './ZoneList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { mockZones } from '../../mockData/zoneDetails';
import { ZoneItem } from '../../models/ZoneItem';
import LocationItemCard from '../../components/zoneItemCard/LocationItemCard';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';

const NoZonesMessage = () : JSX.Element => (
  <View style={styles.noZones}>
    <Text>{strings('LOCATION.NO_ZONES_AVAILABLE')}</Text>
  </View>
);

interface ZoneProps {
    siteId: number,
    zoneList: ZoneItem[]
}

export const ZoneScreen = (props: ZoneProps) : JSX.Element => {
  const { siteId, zoneList } = props;

  return (
    <View>
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${siteId}`}
        details={`${zoneList.length} ${strings('LOCATION.ZONES')}`}
      />

      <FlatList
        data={zoneList}
        renderItem={({ item }) => (
          <LocationItemCard
            locationName={item.zoneName}
            locationDetails={`${item.aisleCount} ${strings('LOCATION.AISLES')}`}
          />
        )}
        keyExtractor={item => item.zoneName}
        ListEmptyComponent={<NoZonesMessage />}
      />
    </View>
  );
};

const ZoneList = (): JSX.Element => {
  const siteId = useTypedSelector(state => state.User.siteId);
  return (<ZoneScreen zoneList={mockZones} siteId={siteId} />);
};

export default ZoneList;
