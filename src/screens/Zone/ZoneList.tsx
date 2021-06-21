import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import styles from './ZoneList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { mockZones } from '../../mockData/zoneDetails';
import { ZoneItem } from '../../models/ZoneItem';
import ZoneItemCard from '../../components/zoneItemCard/ZoneItemCard';
import { strings } from '../../locales';

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
  const { siteId } = props;
  const { zoneList } = props;

  return (
    <View>
      <View style={styles.staticHeader}>
        <Text>
          {`${strings('GENERICS.CLUB')} ${siteId}`}
        </Text>
        <Text style={styles.areas}>
          {`${zoneList.length} ${strings('LOCATION.AREAS')}`}
        </Text>
      </View>
      <FlatList
        data={zoneList}
        renderItem={({ item }) => (
          <ZoneItemCard
            zoneName={item.zoneName}
            aisleCount={item.aisleCount}
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
