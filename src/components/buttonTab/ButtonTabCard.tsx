import React from 'react';
import { View } from 'react-native';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import styles from './ButtonTabCard.style';

interface ButtonBottomTabProps{
  reject: string;
  onRejectPress: () => void;
  approve: string;
  onApprovePress: () => void;
}
export const ButtonBottomTab = (props: ButtonBottomTabProps) => {
  const {
    reject, onRejectPress, approve, onApprovePress
  } = props;
  return (
    <View style={styles.mainBarContainer}>
      <Button
        style={styles.rejectButton}
        backgroundColor={COLOR.WHITE}
        titleColor={COLOR.MAIN_THEME_COLOR}
        title={reject}
        onPress={() => onRejectPress}
      />
      <Button
        style={styles.approveButton}
        title={approve}
        backgroundColor={COLOR.MAIN_THEME_COLOR}
        onPress={() => onApprovePress}
      />
    </View>
  );
};
