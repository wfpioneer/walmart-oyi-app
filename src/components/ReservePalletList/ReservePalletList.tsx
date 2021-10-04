import React from 'react';
import { FlatList, View } from 'react-native';
import { Reserve } from '../../models/LocationItems';
import ReservePalletRow from '../ReservePalletRow/ReservePalletRow';
// import ReservePalletRow from '../FloorItemRow/FloorItemRow';

export interface ReservePalletListProps {
    reservePallets: Reserve[]
}

const ReservePalletList = (props: ReservePalletListProps): JSX.Element => (
  <View>
    <FlatList
      data={props.reservePallets}
      renderItem={({ item }) => <ReservePalletRow reservePallet={item} />}
      keyExtractor={(reservePallet, idx) => `${reservePallet.palletId}${idx}`}
    />
  </View>
);

export default ReservePalletList;
