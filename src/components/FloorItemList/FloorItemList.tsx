import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { FloorItem } from '../../models/LocationItems';
import styles from './FloorItemRow.style';

export interface FloorItemListProps {
    items: FloorItem[]
}

// type FloorItemProps = { item: FloorItem, navigation: NavigationProp<any>, dispatch: Dispatch<any>}
type FloorItemProps = { item: FloorItem };

export const FloorItemRow = (props: FloorItemProps): JSX.Element => {
  const { item } = props;

  return (
    <View>
      <View style={styles.content}>
        <Text>{item.itemNbr}</Text>
        <Text>{item.itemDesc}</Text>
        <Text>{item.price}</Text>
      </View>
    </View>
  );
};

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
