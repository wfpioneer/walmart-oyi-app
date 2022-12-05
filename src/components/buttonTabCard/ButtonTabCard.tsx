import React from 'react';
import { View } from 'react-native';
import COLOR from '../../themes/Color';
import Button, { ButtonType } from '../buttons/Button';
import styles from './ButtonTabCard.style';

interface ButtonBottomTabProps{
  leftTitle: string;
  onLeftPress: () => void;
  rightTitle: string;
  onRightPress: () => void;
  disableLeftButton?: boolean;
  disableRightButton?: boolean;
}

export const ButtonBottomTab = (props: ButtonBottomTabProps): JSX.Element => {
  const {
    leftTitle, onLeftPress, rightTitle, onRightPress, disableLeftButton, disableRightButton
  } = props;
  return (
    <View style={styles.mainBarContainer}>
      <Button
        style={styles.buttonAlign}
        title={leftTitle}
        titleColor={COLOR.MAIN_THEME_COLOR}
        type={ButtonType.SOLID_WHITE}
        onPress={() => onLeftPress()}
        disabled={disableLeftButton}
      />
      <Button
        style={styles.buttonAlign}
        title={rightTitle}
        type={ButtonType.PRIMARY}
        onPress={() => onRightPress()}
        disabled={disableRightButton}
      />
    </View>
  );
};

ButtonBottomTab.defaultProps = {
  disableLeftButton: false,
  disableRightButton: false
};
