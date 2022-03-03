import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { strings } from '../../locales';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './BinningItemCard.style';
import COLOR from "../../themes/Color";

interface Props {
  palletId: number;
  itemDesc: string;
  lastLocation?: string;
  canDelete?: boolean;
  onClick?(): void;
  onDelete?(): void;
}

export const BinningItemCard = (props: Props): JSX.Element => {
  const { palletId, itemDesc, lastLocation, onClick, onDelete, canDelete } = props;
  return (
    <TouchableOpacity onPress={() => { onClick && onClick()}}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.firstLineContainer}>
            <View>
              <Text>{`Id: ${palletId}`}</Text>
            </View>
            {lastLocation &&
            <View style={styles.lastLocationContainer}>
              <Text>{`Last Loc: ${lastLocation}`}</Text>
            </View>
            }
          </View>
          <View>
            <Text>{`First Item: ${itemDesc}`}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.icon} onPress={() => { onDelete && onDelete() }}>
            <View>
              <Icon name="trash-can" size={40} color={COLOR.TRACKER_GREY} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
};

export default BinningItemCard;