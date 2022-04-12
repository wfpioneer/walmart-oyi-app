import React from 'react';
import { FlatList, View } from 'react-native';
import ListGroup from '../../components/ListGroup/ListGroup';
import { PickListItem } from '../../models/Picking.d';
import { strings } from '../../locales';

interface SalesFloorTabProps {
  readyToWorklist: PickListItem[];
}

const FRONT = 'Front';
const getZoneFromPalletLocation = (pickItem: PickListItem) => (pickItem.palletLocationName && !pickItem.moveToFront
  ? pickItem.palletLocationName
    .substring(0, pickItem.palletLocationName.indexOf('-'))
    .replace(/[\d.]+$/, '')
  : FRONT);

export const SalesFloorTabScreen = (props: SalesFloorTabProps) => {
  const { readyToWorklist } = props;

  const listGroupMap: Map<string, PickListItem[]> = new Map().set(FRONT, []);

  // Assigns each picklist item to a zone or the moveToFront group
  readyToWorklist.forEach(pickItem => {
    const zoneName = getZoneFromPalletLocation(pickItem);
    if (zoneName === FRONT) {
      const movedToFrontList = listGroupMap.get(FRONT);
      if (movedToFrontList) {
        movedToFrontList?.push(pickItem);
        listGroupMap.set(FRONT, movedToFrontList);
      }
    } else if (listGroupMap.has(zoneName)) {
      const zoneItems = listGroupMap.get(zoneName);
      if (zoneItems) {
        zoneItems.push(pickItem);
        listGroupMap.set(zoneName, zoneItems);
      }
    } else {
      listGroupMap.set(zoneName, [pickItem]);
    }
  });

  const picklistGroup = Object.fromEntries(listGroupMap);
  // Sort all keys excluding Front group
  const picklistZoneKeys = Object.keys(picklistGroup)
    .filter(keyName => keyName !== FRONT)
    .sort((a, b) => (a > b ? 1 : -1));
  // Set Front group as the first index
  const allPicklistKeys = [FRONT, ...picklistZoneKeys];

  return (
    <View>
      <FlatList
        data={allPicklistKeys}
        renderItem={({ item }) => (
          <ListGroup
            title={`${item === FRONT ? strings('PICKING.FRONT') : item} (${
              picklistGroup[item] ? picklistGroup[item].length : 0
            })`}
            pickListItems={picklistGroup[item]}
            groupItems={true}
          />
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
      />
    </View>
  );
};
const SalesFloorTab = (props: { readyToWorklist: PickListItem[] }) => (
  <SalesFloorTabScreen readyToWorklist={props.readyToWorklist} />
);

export default SalesFloorTab;