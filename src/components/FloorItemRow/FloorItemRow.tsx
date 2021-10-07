import React from 'react';
import { Text, View } from 'react-native';
import styles from './FloorItemRow.style';
import { currencies, strings } from '../../locales';
import { SectionDetailsItem } from '../../models/LocationItems';

export type FloorItemRowProps = { item: SectionDetailsItem };

const FloorItemRow = (props: FloorItemRowProps): JSX.Element => {
  const { item } = props;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.itemNbr}>
          {`${strings('ITEM.ITEM')} ${item.itemNbr}`}
        </Text>
        <Text style={styles.itemDesc}>{item.itemDesc}</Text>
        <Text style={styles.price}>{currencies(item.price)}</Text>
      </View>
    </View>
  );
};

export default FloorItemRow;
