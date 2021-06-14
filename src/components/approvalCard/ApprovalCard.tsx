import React from 'react';
import { Image, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Dispatch } from 'redux';
import { strings } from '../../locales';
import styles from './ApprovalCard.style';
import COLOR from '../../themes/Color';
import { toggleItem } from '../../state/actions/Approvals';
import { QuantityChange } from '../quantityChange/QuantityChange';

export interface ApprovalCardProps{
  image?: string;
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
    image, itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, userId, daysLeft, isChecked, dispatch
  } = props;

  return (
    <View style={styles.cardContainer}>
      <Image source={image ? { uri: image } : require('../../assets/images/placeholder.png')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.itemNumber}>{`${strings('ITEM.ITEM')} ${itemNbr}`}</Text>
        <View style={styles.itemInfoContainer}>
          <Text style={styles.itemDesc}>{itemName}</Text>
          <View style={styles.checkBox}>
            <Checkbox
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={() => dispatch(toggleItem(itemNbr, !isChecked))}
              color={COLOR.MAIN_THEME_COLOR}
              uncheckedColor={COLOR.MAIN_THEME_COLOR}
            />
          </View>
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
    </View>
  );
};

ApprovalCard.defaultProps = {
  image: undefined,
  isChecked: false
};
