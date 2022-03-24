import React from 'react';
import { FlatList, Text, View } from 'react-native';
import PickItemInfo from '../../components/PickItemInfoCard/PickItemInfoCard';
import { PickListItem, PickStatus } from '../../models/Picking.d';

// TODO Replace with PickTab Screen Component https://jira.walmart.com/browse/INTLSAOPS-5445
const PickingScreen = () => {
  const mockPickListItem: PickListItem[] = [
    {
      assignedAssociate: 'me',
      category: 71,
      createTS: '10:32 AM 02/04/2022',
      createdBy: 'someone else',
      id: 418,
      itemDesc: 'Teapot',
      itemNbr: 734,
      moveToFront: true,
      palletId: 4321,
      palletLocation: 'C1-2',
      quickPick: false,
      salesFloorLocation: 'C1-3',
      status: PickStatus.ACCEPTED_PICK,
      upcNbr: '000041800003'
    }
  ];
  return (
    <View>
      <Text> Picking Screen </Text>
      <FlatList
        data={mockPickListItem}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PickItemInfo
            pickListItem={item}
            canDelete={true}
            onDeletePressed={() => undefined}
          />
        )}
      />
    </View>
  );
};

const Picking = () => <PickingScreen />;

export default Picking;
