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

export const ButtonBottomTab = (props: ButtonBottomTabProps): JSX.Element => {
  const {
    leftTitle, onLeftPress, rightTitle, onRightPress
  } = props;
  return (
    <View style={styles.mainBarContainer}>
      <Button
        style={styles.buttonAlign}
        title={leftTitle}
        titleColor={COLOR.MAIN_THEME_COLOR}
        type={Button.Type.SOLID_WHITE}
        onPress={() => onLeftPress()}
      />
      <Button
        style={styles.buttonAlign}
        title={rightTitle}
        type={Button.Type.PRIMARY}
        onPress={() => onRightPress()}
      />
    </View>
  );
};
