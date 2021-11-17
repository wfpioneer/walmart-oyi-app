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
  value: number;
}

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

const NumericSelector = (props: NumericSelectorProps): JSX.Element => (
  <View
    style={[styles.updateContainer, props.isValid ? styles.updateContainerValid : styles.updateContainerInvalid]}
  >
    <IconButton
      icon={renderPlusMinusBtn('minus')}
      type={IconButton.Type.NO_BORDER}
      height={15}
      width={35}
      onPress={props.onDecreaseQty}
    />
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      onChangeText={props.onTextChange}
    >
      {props.value}
    </TextInput>
    <IconButton
      icon={renderPlusMinusBtn('plus')}
      type={IconButton.Type.NO_BORDER}
      height={15}
      width={35}
      onPress={props.onIncreaseQty}
    />
  </View>
);

export default NumericSelector;
