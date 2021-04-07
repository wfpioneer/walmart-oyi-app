import React from 'react';
import { Text, View } from 'react-native';
import styles from './CategorySeparator.style';
import { strings } from '../../locales';

interface PropsI {
  categoryName: string;
  numberOfItems: number;
}
// TODO move & rename Category Separator into it's own folder directory
export const CategorySeparator = (props: PropsI) => (
  <View style={styles.container}>
    <Text style={styles.categoryName}>
      { props.categoryName }
    </Text>
    <Text style={styles.numberOfItems}>
      { `${props.numberOfItems} ${props.numberOfItems === 1 ? strings('WORKLIST.ITEM') : strings('WORKLIST.ITEMS')}`}
    </Text>
  </View>
);
