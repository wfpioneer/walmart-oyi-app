import React from 'react';
import { FlatList, View } from 'react-native';
import { FloorItem } from '../../models/LocationItems';
import FloorItemRow from '../FloorItemRow/FloorItemRow';

export interface FloorItemListProps {
    items: FloorItem[]
}

const FloorItemList = (props: FloorItemListProps): JSX.Element => (
  <View>
    <FlatList
      data={props.items}
      renderItem={({ item }) => <FloorItemRow item={item} />}
      keyExtractor={(item, idx) => `${item.itemNbr}${idx}`}
    />
  </View>
);

export default FloorItemList;
