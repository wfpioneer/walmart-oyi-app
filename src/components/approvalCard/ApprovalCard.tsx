import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import { currencies, strings } from '../../locales';
import styles from './ApprovalCard.style';
import COLOR from '../../themes/Color';

export interface ApprovalCardProps{
  image?: string;
  itemNbr: number;
  itemName: string;
  oldQuantity: number;
  newQuantity: number;
  dollarChange: number;
  userId: string;
  daysLeft: number;
}

export const ApprovalCard = (props: ApprovalCardProps) => {
  const {
    image, itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, userId, daysLeft
  } = props;
  // TODO The CheckBox will need to changed for the `Select/Deselect All` tasks and add a proper tests
  const [checked, setChecked] = useState(true);

  const positiveQtyChange = () => newQuantity > oldQuantity;
  return (
    <View style={styles.cardContainer}>
      <Image source={image ? { uri: image } : require('../../assets/images/placeholder.png')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.itemNumber}>{`${strings('ITEM.ITEM')} ${itemNbr}`}</Text>
        <View style={styles.itemInfoContainer}>
          <Text style={styles.itemDesc}>{itemName}</Text>
          <View style={styles.checkBox}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
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
        <View style={styles.onHandsContainer}>
          <View style={styles.quantityCalc}>
            <Text style={styles.quantityHeader}>{strings('APPROVAL.CURRENT_QUANTITY')}</Text>
            <Text style={styles.quantityText}>{oldQuantity}</Text>
          </View>
          <View style={styles.quantityCalc}>
            <Text style={styles.quantityHeader}>{strings('APPROVAL.OH_CHANGE')}</Text>
            <View style={styles.onHandsChange}>
              <Text style={positiveQtyChange() ? styles.positiveChange : styles.negativeChange}>
                <Octicons name={positiveQtyChange() ? 'arrow-up' : 'arrow-down'} size={20} />
                {currencies(dollarChange)}
              </Text>
              <Text style={styles.divider}> | </Text>
              <Text style={[styles.quantityText, positiveQtyChange() ? styles.positiveChange : styles.negativeChange]}>
                {newQuantity - oldQuantity}
              </Text>
            </View>
          </View>
          <View style={styles.quantityResult}>
            <Text style={styles.resultText}>{newQuantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
