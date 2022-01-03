import React from 'react';
import { TextInput, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './NumericSelector.style';
import COLOR from '../../themes/Color';
import IconButton from '../buttons/IconButton';

interface NumericSelectorProps {
  isValid: boolean;
  onDecreaseQty(): void;
  onIncreaseQty(): void;
  onTextChange(text: string): void;
  minValue: number;
  maxValue: number;
  value: number;
}

const renderPlusMinusBtn = (name: 'plus' | 'minus', isDisabled: boolean) => (
  <MaterialCommunityIcon
    name={name}
    color={isDisabled ? COLOR.DISABLED_BLUE : COLOR.MAIN_THEME_COLOR}
    size={18}
  />
);

const NumericSelector = (props: NumericSelectorProps): JSX.Element => {
  const {
    isValid,
    onDecreaseQty,
    onIncreaseQty,
    onTextChange,
    minValue,
    maxValue,
    value
  } = props;
  const isMinimum = value <= minValue;
  const isMaximum = value >= maxValue;
  return (
    <View
      style={[
        styles.updateContainer,
        isValid ? styles.updateContainerValid : styles.updateContainerInvalid
      ]}
    >
      <IconButton
        icon={renderPlusMinusBtn('minus', isMinimum)}
        type={IconButton.Type.NO_BORDER}
        height={15}
        width={35}
        onPress={isMinimum ? undefined : onDecreaseQty}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={onTextChange}
      >
        {value}
      </TextInput>
      <IconButton
        icon={renderPlusMinusBtn('plus', isMaximum)}
        type={IconButton.Type.NO_BORDER}
        height={15}
        width={35}
        onPress={isMaximum ? undefined : onIncreaseQty}
      />
    </View>
  );
};

export default NumericSelector;
