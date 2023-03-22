import React from 'react';
import { View } from 'react-native';
import COLOR from '../../themes/Color';
import Button, { ButtonPropsI, ButtonType } from '../buttons/Button';
import styles from './ButtonTabCard.style';

interface ButtonBottomTabProps
  extends Omit<
    ButtonPropsI,
    'style' | 'type' | 'disabled' | 'title' | 'titleColor' | 'onPress'
  > {
  leftTitle: string;
  onLeftPress: () => void;
  rightTitle: string;
  onRightPress: () => void;
  disableLeftButton?: boolean;
  disableRightButton?: boolean;
  containerHeight?: number | string
}

export const ButtonBottomTab = (props: ButtonBottomTabProps): JSX.Element => {
  const {
    leftTitle,
    onLeftPress,
    rightTitle,
    onRightPress,
    disableLeftButton,
    disableRightButton,
    backgroundColor,
    height,
    radius,
    testID,
    titleAlign,
    titleFontSize,
    titleFontWeight,
    width,
    containerHeight
  } = props;
  return (
    <View style={[styles.mainBarContainer, { height: containerHeight }]}>
      <Button
        style={styles.buttonAlign}
        title={leftTitle}
        titleColor={COLOR.MAIN_THEME_COLOR}
        type={ButtonType.SOLID_WHITE}
        onPress={() => onLeftPress()}
        disabled={disableLeftButton}
        backgroundColor={backgroundColor}
        height={height}
        radius={radius}
        titleAlign={titleAlign}
        titleFontSize={titleFontSize}
        titleFontWeight={titleFontWeight}
        width={width}
      />
      <Button
        style={styles.buttonAlign}
        title={rightTitle}
        type={ButtonType.PRIMARY}
        onPress={() => onRightPress()}
        disabled={disableRightButton}
        backgroundColor={backgroundColor}
        height={height}
        radius={radius}
        titleAlign={titleAlign}
        titleFontSize={titleFontSize}
        titleFontWeight={titleFontWeight}
        width={width}
      />
    </View>
  );
};

ButtonBottomTab.defaultProps = {
  disableLeftButton: false,
  disableRightButton: false,
  containerHeight: 80
};
