import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ListGroup from '../../components/ListGroup/ListGroup';
import { strings } from '../../locales';
import { PickListItem } from '../../models/Picking';

interface SalesFloorTabProps {
  picklist: PickListItem[];
}
const SalesFloorTabScreen = (props: SalesFloorTabProps) => {
  const { picklist } = props;
  return (
    <View>
      <FlatList
        data={picklist}
        renderItem={({ item }) => (
          <ListGroup
            title={`${item.palletLocationName} (72)`}
            pickListItems={picklist}
            groupItems={false}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
    </View>
  );
};
const SalesFloorTab = (props: { picklist: PickListItem[] }) => (
  <SalesFloorTabScreen picklist={props.picklist} />
);

export default SalesFloorTab;
