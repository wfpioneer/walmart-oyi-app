/* eslint-disable react/require-default-props */
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { strings } from '../../locales';
import styles from './BinningItemCard.style';

interface Props {
  palletId: number;
  itemDesc: string;
  lastLocation?: string;
  canDelete?: boolean;
  onClick?(): void;
  onDelete?(): void;
}

export const BinningItemCard = (props: Props): JSX.Element => {
  const {
    palletId, itemDesc, lastLocation, onClick, onDelete, canDelete
  } = props;
  return (
    <TouchableOpacity onPress={() => onClick && onClick()}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.firstLineContainer}>
            <View>
              <Text>{`${strings('PALLET.PALLET_ID')}: ${palletId}`}</Text>
            </View>
            {lastLocation
            && (
            <View style={styles.lastLocationContainer}>
              <Text>{`${strings('BINNING.LAST_LOC')}: ${lastLocation}`}</Text>
            </View>
            )}
          </View>
          {itemDesc
            ? (
              <View>
                <Text>{`${strings('BINNING.FIRST_ITEM')}: ${itemDesc}`}</Text>
              </View>
            )
            : (
              <View>
                <Text style={styles.emptyPalletMsg}>{`${strings('BINNING.EMPTY_PALLET')}`}</Text>
              </View>
            )}
        </View>
        {canDelete
        && (
        <View>
          <TouchableOpacity style={styles.icon} onPress={() => onDelete && onDelete()}>
            <View>
              <Image
                source={require('../../assets/images/trash_can.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BinningItemCard;
