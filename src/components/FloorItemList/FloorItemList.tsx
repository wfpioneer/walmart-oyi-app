import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { FloorItem } from '../../models/LocationItems';
import styles from './FloorItemRow.style';
import { currencies, strings } from '../../locales';

export interface FloorItemListProps {
    items: FloorItem[]
}

// type FloorItemProps = { item: FloorItem, navigation: NavigationProp<any>, dispatch: Dispatch<any>}
type FloorItemProps = { item: FloorItem };

export const FloorItemRow = (props: FloorItemProps): JSX.Element => {
  const { item } = props;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.itemNbr}>
          {`${strings('ITEM.ITEM')} ${item.itemNbr}`}
        </Text>
        <Text>{item.itemDesc}</Text>
        <Text style={styles.price}>{currencies(item.price)}</Text>
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
