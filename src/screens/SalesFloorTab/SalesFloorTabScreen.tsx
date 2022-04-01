import { groupBy } from 'lodash';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListGroup from '../../components/ListGroup/ListGroup';
import { PickListItem } from '../../models/Picking';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface SalesFloorTabProps {
  picklist: PickListItem[];
  navigation: NavigationProp<any>;
}
const getZoneFromPalletLocation = (palletLocation: string | undefined) =>
  palletLocation
    ? palletLocation
        .substring(0, palletLocation.indexOf('-'))
        .replace(/[\d.]+$/, '')
    : '';

const SalesFloorTabScreen = (props: SalesFloorTabProps) => {
  const { picklist, navigation } = props;
  const groupedPickListByZone = groupBy(picklist, (item: PickListItem) =>
    getZoneFromPalletLocation(item.palletLocationName)
  );
  const pickListKeys = Object.keys(groupedPickListByZone);

  return (
    <View>
      <FlatList
        data={pickListKeys}
        renderItem={({ item }) => (
          <ListGroup
            title={`${item} (${groupedPickListByZone[item].length})`}
            pickListItems={groupedPickListByZone[item]}
            groupItems={false}
            navigation={navigation}
          />
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
      />
    </View>
  );
};
const SalesFloorTab = (props: { picklist: PickListItem[] }) => {
  const navigation = useNavigation();
  return (
  <SalesFloorTabScreen picklist={props.picklist} navigation={navigation}/>
)};

export default SalesFloorTab;
