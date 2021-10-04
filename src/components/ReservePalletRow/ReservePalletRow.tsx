import React from 'react';
import { Text, View } from 'react-native';
import styles from './ReservePalletRow.style';
import { strings } from '../../locales';
import { Reserve } from '../../models/LocationItems';

export type ReservePalletRowProps = { reservePallet: Reserve };

const ReservePalletRow = (props: ReservePalletRowProps): JSX.Element => {
  const { reservePallet } = props;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.palletId}>
          {`${strings('PALLET.PALLET')} ${reservePallet.palletId}`}
        </Text>
        <Text style={styles.palletCreateTs}>
          {`${strings('PALLET.CREATE_TS')} ${reservePallet.palletCreateTS}`}
        </Text>
        <Text style={styles.itemNbr}>
          {`${strings('GENERAL.ITEM')} ${reservePallet.items[0]?.itemNbr}`}
        </Text>
        <Text style={styles.itemDesc}>
          {reservePallet.items[0]?.itemDesc}
        </Text>
        { reservePallet.items.length > 1
        && (
        <Text style={styles.itemDesc}>
          {`+${reservePallet.items.length - 1} ${strings('PALLET.MORE')}`}
        </Text>
        )}
      </View>
    </View>
  );
};

export default ReservePalletRow;
