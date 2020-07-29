import React from 'react';
import { View, Text } from 'react-native';
import styles from './CategorySeparator.style';
import { strings } from "../../locales";

interface PropsI {
  categoryName: string;
  categoryNumber: number;
  numberOfItems?: number;
}

export const CategorySeparator = (props: PropsI) => {
  return (
    <View style={ styles.container }>
      <Text style={styles.categoryName}>
        { props.categoryName }
      </Text>
      <Text style={styles.numberOfItems}>
        { `${props.numberOfItems} ${ props.numberOfItems === 1 ? strings('WORKLIST.ITEM') : strings('WORKLIST.ITEMS')}`}
      </Text>
    </View>
  )
}
