import React from 'react';
import { Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Dispatch } from 'redux';
import { strings } from '../../locales';
import styles from './ApprovalCard.style';
import COLOR from '../../themes/Color';
import { toggleItem } from '../../state/actions/Approvals';
import { QuantityChange } from '../quantityChange/QuantityChange';

export interface ApprovalCardProps{
  itemNbr: number;
  itemName: string;
  oldQuantity: number;
  newQuantity: number;
  dollarChange: number;
  userId: string;
  daysLeft?: number;
  isChecked?: boolean;
  dispatch: Dispatch<any>;
}

export const ApprovalCard = (props: ApprovalCardProps): JSX.Element => {
  const {
    itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, userId, daysLeft, isChecked, dispatch
  } = props;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.itemNumber}>{`${strings('ITEM.ITEM')} ${itemNbr}`}</Text>
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemDesc}>{itemName}</Text>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => dispatch(toggleItem(itemNbr, !isChecked))}
          color={COLOR.MAIN_THEME_COLOR}
          uncheckedColor={COLOR.MAIN_THEME_COLOR}
        />
      </View>
      <View style={styles.timeLeftContainer}>
        <Text style={styles.userText} ellipsizeMode="tail" numberOfLines={1}>{userId}</Text>
        <Text style={styles.timeLeftDivider}>|</Text>
        <Text style={styles.daysText}>{strings('APPROVAL.DAYS_LEFT', { time: daysLeft || 0 })}</Text>
      </View>
      <QuantityChange
        oldQty={oldQuantity}
        newQty={newQuantity}
        dollarChange={dollarChange}
      />
    </View>
  );
};

ApprovalCard.defaultProps = {
  isChecked: false
};
