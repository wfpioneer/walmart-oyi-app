import React from 'react';
import { TextInput, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './NumericSelector.style';
import COLOR from '../../themes/Color';
import IconButton from '../buttons/IconButton';

interface NumericSelectorProps {
  // eslint-disable-next-line react/require-default-props
  testID?: string;
  isValid: boolean;
  onDecreaseQty(): void;
  onIncreaseQty(): void;
  onTextChange(text: string): void;
  minValue: number;
  maxValue: number;
  value: number;
  onEndEditing?: () => void;
}

// Move to stringUtils file if we make one
export const numberInputFilter = (text: string): string => text.replace(/[^0-9-]/g, '').replace(/(?!^)-/g, '');

const renderPlusMinusBtn = (name: 'plus' | 'minus', isDisabled: boolean) => (
  <MaterialCommunityIcon
    name={name}
    color={isDisabled ? COLOR.DISABLED_BLUE : COLOR.MAIN_THEME_COLOR}
    size={18}
  />
);

const NumericSelector = (props: NumericSelectorProps): JSX.Element => {
  const {
    testID,
    isValid,
    onDecreaseQty,
    onIncreaseQty,
    onTextChange,
    minValue,
    maxValue,
    value,
    onEndEditing
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
        type={IconButton.Type.NO_BORDER}
        height={15}
        width={35}
        disabled={isMinimum}
        onPress={onDecreaseQty}
      />
      <TextInput
        testID="numericTextInput"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={text => onTextChange(numberInputFilter(text))}
        value={value ? value.toString() : ''}
        onEndEditing={onEndEditing}
      />
      <IconButton
        testID="increaseButton"
        icon={renderPlusMinusBtn('plus', isMaximum)}
        type={IconButton.Type.NO_BORDER}
        height={15}
        width={35}
        disabled={isMaximum}
        onPress={onIncreaseQty}
      />
    </View>
  );
};

export default NumericSelector;

NumericSelector.defaultProps = {
  onEndEditing: () => {}
};
