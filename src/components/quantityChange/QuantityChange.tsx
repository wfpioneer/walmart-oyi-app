import React from 'react';
import { Text, View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { currencies, strings } from '../../locales';
import styles from './QuantityChange.style';

export interface QuantityChangeProps {
  oldQty: number;
  newQty: number;
  dollarChange: number;
}

export const qtyStyleChange = (oldQty: number, newQty: number): Record<string, unknown> => {
  if (oldQty === 0 && newQty === 0) {
    return styles.noOHChange;
  }
  if (newQty > oldQty) {
    return styles.positiveChange;
  }
  return styles.negativeChange;
};

export const QuantityChange = (props: QuantityChangeProps): JSX.Element => {
  const { oldQty, newQty, dollarChange } = props;
  return (
    <View style={styles.onHandsContainer}>
      <View style={styles.quantityCalc}>
        <Text style={styles.quantityHeader}>{strings('APPROVAL.CURRENT_QUANTITY')}</Text>
        <Text style={styles.quantityText}>{oldQty}</Text>
      </View>
      <View style={styles.quantityCalc}>
        <Text style={styles.quantityHeader}>{strings('APPROVAL.OH_CHANGE')}</Text>
        <View style={styles.onHandsChange}>
          <Text style={qtyStyleChange(oldQty, newQty)}>
            {(oldQty !== 0 || newQty !== 0)
          && (<Octicons name={newQty > oldQty ? 'arrow-up' : 'arrow-down'} size={20} />)}
            {currencies(dollarChange)}
          </Text>
          <Text style={styles.quantityDivider}> | </Text>
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
};
