import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import styles from './ReservePalletRow.style';
import { strings } from '../../locales';
import { SectionDetailsPallet } from '../../models/LocationItems';

export type ReservePalletRowProps = { reservePallet: SectionDetailsPallet };
const ReservePalletRow = (props: ReservePalletRowProps): JSX.Element => {
  const { reservePallet } = props;
  const userFeatures = useTypedSelector(state => state.User.features);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pallet}>
          <Text style={styles.textHeader}>
            {`${strings('LOCATION.PALLET')} ${reservePallet.palletId}`}
          </Text>
          <View>
            { userFeatures.includes('location management edit') && (
              // TODO: Image controls will be replaced with button in the future.
              <Image
                source={require('../../assets/images/trash_can.png')}
              />
            )}
          </View>
        </View>
        <Text style={styles.palletCreateTs}>
          {`${strings('LOCATION.CREATED_ON')} ${reservePallet.palletCreateTS}`}
        </Text>
        { reservePallet.items.length > 0 && (
        <View style={styles.itemContainer}>
          <Text style={styles.itemNbr}>
            {`${strings('ITEM.ITEM')} ${reservePallet.items[0]?.itemNbr}`}
          </Text>
          <Text>
            {reservePallet.items[0].itemDesc}
          </Text>
          { reservePallet.items.length > 1
              && (
              <Text style={styles.moreText}>
                {`+${reservePallet.items.length - 1} ${strings('LOCATION.MORE')}`}
              </Text>
              )}
        </View>
        )}
      </View>
    </View>
  );
};

export default ReservePalletRow;
