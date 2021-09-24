import React from 'react';
import { Text, View } from 'react-native';
import { Floor } from '../../models/LocationItems';

export interface FloorItemListProps {
    items: Floor[]
}

const FloorItemList = (props: FloorItemListProps): JSX.Element => (
  <View>
    { props.items.map(item => (
      <View key={item.itemNbr}>
        <Text>{item.itemDesc}</Text>
      </View>
    ))}
  </View>
);

export default FloorItemList;
