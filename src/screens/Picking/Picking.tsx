import React from 'react';
import { FlatList, Text, View } from 'react-native';
import PickItemInfo from '../../components/PickItemInfoCard/PickItemInfoCard';
import { mockPickLists } from '../../mockData/mockPickList';

// TODO Replace with PickTab Screen Component https://jira.walmart.com/browse/INTLSAOPS-5445
const PickingScreen = () => (
  <View>
    <Text> Picking Screen </Text>
    <FlatList
      data={mockPickLists}
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

const Picking = () => <PickingScreen />;

export default Picking;
