import React from 'react';
import { FlatList, View } from 'react-native';
import ListGroup from '../../components/ListGroup/ListGroup';
import { PickListItem } from '../../models/Picking';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { strings } from '../../locales';

interface SalesFloorTabProps {
  picklist: PickListItem[];
  navigation: NavigationProp<any>;
}

const FRONT = 'Front';
const getZoneFromPalletLocation = (pickItem: PickListItem) => {
  return pickItem.palletLocationName && !pickItem.moveToFront
    ? pickItem.palletLocationName
        .substring(0, pickItem.palletLocationName.indexOf('-'))
        .replace(/[\d.]+$/, '')
    : FRONT;
};

const SalesFloorTabScreen = (props: SalesFloorTabProps) => {
  const { picklist, navigation } = props;

  const listGroupMap: Map<string, PickListItem[]> = new Map().set(FRONT, []);

  // Assigns each picklist item to a zone or the moveToFront group
  picklist.forEach(pickItem => {
    let zoneName = getZoneFromPalletLocation(pickItem);
    if (zoneName === FRONT) {
      const movedToFrontList = listGroupMap.get(FRONT);
      if (movedToFrontList) {
        movedToFrontList?.push(pickItem);
        listGroupMap.set(FRONT, movedToFrontList);
      }
    }
    if (zoneName !== FRONT && listGroupMap.has(zoneName)) {
      let zoneItems = listGroupMap.get(zoneName);
      if (zoneItems) {
        zoneItems.push(pickItem);
        listGroupMap.set(zoneName, zoneItems);
      }
    } else if (zoneName !== FRONT && !listGroupMap.has(zoneName)) {
      listGroupMap.set(zoneName, [pickItem]);
    }
  });

  const picklistGroup = Object.fromEntries(listGroupMap);
  // Sort all keys excluding Front group
  const picklistZoneKeys = Object.keys(picklistGroup)
    .filter(keyName => keyName !== FRONT)
    .sort((a, b) => (a > b ? 1 : -1));
  // Set Front group as the first index
  const allPickKeys = [FRONT, ...picklistZoneKeys];

  return (
    <View>
      <FlatList
        data={allPickKeys}
        renderItem={({ item }) => (
          <ListGroup
            title={`${item === FRONT ? strings('PICKING.FRONT') : item} (${
              picklistGroup[item] ? picklistGroup[item].length : 0
            })`}
            pickListItems={picklistGroup[item]}
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
    <SalesFloorTabScreen picklist={props.picklist} navigation={navigation} />
  );
};

export default SalesFloorTab;
