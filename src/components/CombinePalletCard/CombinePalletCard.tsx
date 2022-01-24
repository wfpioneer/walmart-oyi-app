import React, { Dispatch } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CombinePallet } from '../../models/PalletManagementTypes';
import styles from './CombinePalletCard.style';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { removeCombinePallet } from '../../state/actions/PalletManagement';

interface PalletCardProps {
  item: CombinePallet;
  dispatch: Dispatch<any>;
}
const CombinePalletCard = (props: PalletCardProps): JSX.Element => {
  const { item, dispatch } = props;
  return (
    <View style={styles.palletCardContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.palletText}>
          {`${strings('PALLET.PALLET_ID')}: ${item.palletId}`}
        </Text>
        <Text style={styles.itemText}>
          {`${strings('GENERICS.ITEMS')}: ${item.itemCount}`}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.trashIcon}
        onPress={() => dispatch(removeCombinePallet(item.palletId))}
      >
        <Icon name="trash-can" size={30} color={COLOR.TRACKER_GREY} />
      </TouchableOpacity>
    </View>
  );
};

export default CombinePalletCard;
