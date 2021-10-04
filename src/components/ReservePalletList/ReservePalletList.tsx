import React from 'react';
import { FlatList, View } from 'react-native';
import { LocationDetailsPallet } from '../../models/LocationItems';
import ReservePalletRow from '../ReservePalletRow/ReservePalletRow';
import styles from './ReservePalletList.style';

export interface ReservePalletListProps {
    reservePallets: LocationDetailsPallet[]
}

const ReservePalletList = (props: ReservePalletListProps): JSX.Element => (
  <View style={styles.listContainer}>
    <FlatList
      data={props.reservePallets}
      renderItem={({ item }) => <ReservePalletRow reservePallet={item} />}
      keyExtractor={(reservePallet, idx) => `${reservePallet.palletId}${idx}`}
    />
  </View>
);

export default ReservePalletList;
