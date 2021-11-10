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
        <Text>
          {`${strings('LOCATION.PALLET')} ${reservePallet.palletId}`}
        </Text>
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
          { userFeatures.includes('location management edit') && (
          <View style={styles.trashIcon}>
            <Image
              source={require('../../assets/images/trash_can.png')}
            />
          </View>
          )}
        </View>
        )}
      </View>
    </View>
  );
};

export default ReservePalletRow;
