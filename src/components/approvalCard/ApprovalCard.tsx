import React from 'react';
import { Image, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import { Dispatch } from 'redux';
import { currencies, strings } from '../../locales';
import styles from './ApprovalCard.style';
import COLOR from '../../themes/Color';
import { toggleItem } from '../../state/actions/Approvals';

export interface ApprovalCardProps{
  image?: string;
  itemNbr: number;
  itemName: string;
  oldQuantity: number;
  newQuantity: number;
  dollarChange: number;
  userId: string;
  daysLeft: number;
  isChecked?: boolean;
  dispatch: Dispatch<any>;
}

export const qtyStyleChange = (oldQty: number, newQty: number) => {
  if ((oldQty && newQty) === 0) {
    return styles.noOHChange;
  }
  if (newQty > oldQty) {
    return styles.positiveChange;
  }
  return styles.negativeChange;
};

export const renderQuantityChange = (oldQty: number, newQty: number, dollarChange: number): JSX.Element => (
  <View style={styles.onHandsContainer}>
    <View style={styles.quantityCalc}>
      <Text style={styles.quantityHeader}>{strings('APPROVAL.CURRENT_QUANTITY')}</Text>
      <Text style={styles.quantityText}>{oldQty}</Text>
    </View>
    <View style={styles.quantityCalc}>
      <Text style={styles.quantityHeader}>{strings('APPROVAL.OH_CHANGE')}</Text>
      <View style={styles.onHandsChange}>
        <Text style={qtyStyleChange(oldQty, newQty)}>
          {(oldQty && newQty) !== 0
          && (<Octicons name={newQty > oldQty ? 'arrow-up' : 'arrow-down'} size={20} />)}
          {currencies(dollarChange)}
        </Text>
        <Text style={styles.divider}> | </Text>
        <Text style={qtyStyleChange(oldQty, newQty)}>
          {newQty - oldQty}
        </Text>
      </View>
    </View>
    <View style={styles.quantityResult}>
      <Text style={styles.resultText}>{newQty}</Text>
    </View>
  </View>
);

export const ApprovalCard = (props: ApprovalCardProps): JSX.Element => {
  const {
    image, itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, userId, daysLeft, isChecked, dispatch
  } = props;
  // TODO The CheckBox will need to changed for the `Select/Deselect All` tasks and add a proper tests

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
          <Text style={styles.divider}>|</Text>
          <Text style={styles.daysText}>{strings('APPROVAL.DAYS_LEFT', { time: daysLeft })}</Text>
        </View>
        {renderQuantityChange(oldQuantity, newQuantity, dollarChange)}
      </View>
    </View>
  );
};

ApprovalCard.defaultProps = {
  image: undefined,
  isChecked: false
};
