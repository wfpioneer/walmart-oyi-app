import React from 'react';
import { Text, View } from 'react-native';
import styles from './WorklistHeader.style';
import { strings } from '../../locales';

interface worklistHeaderPropsI {
  title: string;
  numberOfItems: number;
}

const WorklistHeader = (props: worklistHeaderPropsI) => (
  <View style={styles.container}>
    <Text style={styles.headerTitle}>
      { props.title }
    </Text>
    <Text style={styles.numberOfItems}>
      { `${props.numberOfItems} ${props.numberOfItems === 1 ? strings('GENERICS.ITEM') : strings('GENERICS.ITEMS')}`}
    </Text>
  </View>
);

export default WorklistHeader;
