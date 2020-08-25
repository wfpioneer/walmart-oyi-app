import React from 'react';
import { FlatList, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import { PrinterType } from '../../../models/Printer';
import { strings } from '../../../locales';
import COLOR from '../../../themes/Color';
import styles from './PrinterList.style';

const PrinterListCard = (cardItem: { item: any }) => {
  const { item } = cardItem;

  return (
    <View style={styles.cardContainer}>
      <MaterialCommunityIcons name="printer" size={20} color={COLOR.BLACK} />
      <View style={styles.printerDescription}>
        <Text>{item.name}</Text>
        <Text>{item.desc}</Text>
      </View>
      <MaterialCommunityIcons name="trash-can" size={20} color={COLOR.BLACK} />
    </View>
  );
};

const ItemSeparator = () => (
  <View style={styles.separator} />
);

export const PrinterList = () => {
  const printerList = useTypedSelector(state => state.Print.printerList);

  return (
    <FlatList
      data={printerList}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={PrinterListCard}
      style={styles.flatList}
    />
  );
};
