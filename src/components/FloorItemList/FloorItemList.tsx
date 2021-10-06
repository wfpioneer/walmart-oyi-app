import React from 'react';
import { FlatList, View } from 'react-native';
import { LocationDetailsItem } from '../../models/LocationItems';
import FloorItemRow from '../FloorItemRow/FloorItemRow';
import styles from './FloorItemList.style';

export interface FloorItemListProps {
    items: LocationDetailsItem[]
}

const FloorItemList = (props: FloorItemListProps): JSX.Element => (
  <View
    style={styles.listContainer}
  >
    <FlatList
      data={props.items}
      renderItem={({ item }) => <FloorItemRow item={item} />}
      keyExtractor={(item, idx) => `${item.itemNbr}${idx}`}
    />
  </View>
);

export default FloorItemList;
