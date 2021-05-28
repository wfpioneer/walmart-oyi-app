import React from 'react';
import { View } from 'react-native';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import styles from './ButtonTabCard.style';

interface ButtonBottomTabProps{
  leftTitle: string;
  onLeftPress: () => void;
  rightTitle: string;
  onRightPress: () => void;
}
export const ButtonBottomTab = (props: ButtonBottomTabProps) => {
  const {
    leftTitle, onLeftPress, rightTitle, onRightPress
  } = props;
  return (
    <View style={styles.mainBarContainer}>
      <Button
        style={styles.rejectButton}
        backgroundColor={COLOR.WHITE}
        titleColor={COLOR.MAIN_THEME_COLOR}
        title={leftTitle}
        onPress={() => onLeftPress()}
      />
      <Button
        style={styles.approveButton}
        title={rightTitle}
        backgroundColor={COLOR.MAIN_THEME_COLOR}
        onPress={() => onRightPress()}
      />
    </View>
  );
};
