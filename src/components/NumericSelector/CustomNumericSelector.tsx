import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './NumericSelector.style';
import COLOR from '../../themes/Color';
import IconButton, { IconButtonType } from '../buttons/IconButton';

interface CustomNumericSelectorProps {
  // eslint-disable-next-line react/require-default-props
  testID?: string;
  isValid: boolean;
  onDecreaseQty(): void;
  onIncreaseQty(): void;
  minValue: number;
  maxValue: number;
  value: number;
  onInputPress: () => void;
}

const renderPlusMinusBtn = (name: 'plus' | 'minus', isDisabled: boolean) => (
  <MaterialCommunityIcon
    name={name}
    color={isDisabled ? COLOR.DISABLED_GREY : COLOR.MAIN_THEME_COLOR}
    size={18}
  />
);

const CustomNumericSelector = (props: CustomNumericSelectorProps): JSX.Element => {
  const {
    testID,
    isValid,
    onDecreaseQty,
    onIncreaseQty,
    minValue,
    maxValue,
    value,
    onInputPress
  } = props;
  const isMinimum = value <= minValue;
  const isMaximum = value >= maxValue;
  return (
    <View
      testID={testID}
      style={[
        styles.updateContainer,
        isValid ? styles.updateContainerValid : styles.updateContainerInvalid
      ]}
    >
      <IconButton
        testID="decreaseButton"
        icon={renderPlusMinusBtn('minus', isMinimum)}
        type={IconButtonType.NO_BORDER}
        height={15}
        width={35}
        disabled={isMinimum}
        onPress={onDecreaseQty}
      />
      <TouchableOpacity onPress={onInputPress} style={styles.buttonInput}>
        <Text style={styles.calcInput}>{value.toString()}</Text>
      </TouchableOpacity>
      <IconButton
        testID="increaseButton"
        icon={renderPlusMinusBtn('plus', isMaximum)}
        type={IconButtonType.NO_BORDER}
        height={15}
        width={35}
        disabled={isMaximum}
        onPress={onIncreaseQty}
      />
    </View>
  );
};

export default CustomNumericSelector;
