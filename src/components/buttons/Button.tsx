import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import COLOR from '../../themes/Color';

/**
 * Custom button component
 *
 */

// eslint-disable-next-line no-shadow
export enum ButtonType {
  PRIMARY = 1,
  SOLID_WHITE = 2,
  NO_BORDER = 3
}

type fontWeightType = 'normal' | 'bold' | '100' | '200' | '300' |
    '400' | '500' | '600' | '700' | '800' | '900' | undefined;

type textAlignType = 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;

interface ButtonPropsI {
  onPress?: () => void,
  title?: string,
  titleColor?: string,
  titleFontSize?: number,
  titleFontWeight?: fontWeightType,
  titleAlign?: textAlignType,
  backgroundColor?: string,
  height?: number | string,
  width?: number | string,
  radius?: number,
  style?: object,
  type?: number,
  disabled?: boolean,
  // eslint-disable-next-line react/require-default-props
  testID?: string
}

export const Button = (props: ButtonPropsI): JSX.Element => {
  const {
    type,
    width,
    height,
    disabled,
    backgroundColor,
    radius,
    style,
    titleColor,
    titleFontSize,
    titleFontWeight,
    titleAlign,
    title,
    testID
  } = props;

  const onButtonPress = () => {
    const { onPress } = props;
    if (onPress !== undefined) {
      onPress();
    }
  };

  const containerStyle = width === -1
    ? { height }
    : {
      height,
      width
    };
  const bgColor = disabled ? COLOR.DISABLED_BLUE : backgroundColor;

  let buttonStyle = {};
  if (type === ButtonType.PRIMARY) {
    buttonStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius,
      backgroundColor: bgColor,
      elevation: 1
    };
  } else if (type === ButtonType.SOLID_WHITE) {
    buttonStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius,
      borderColor: bgColor,
      borderWidth: 1,
      backgroundColor: COLOR.WHITE
    };
  } else if (type === ButtonType.NO_BORDER) {
    buttonStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLOR.TRANSPARENT
    };
  }
  return (
    <View style={[containerStyle, style]}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onButtonPress}
          activeOpacity={0.8}
          style={buttonStyle}
          testID={testID}
        >
          <Text
            style={{
              color: titleColor,
              fontSize: titleFontSize,
              fontFamily: 'Roboto-Medium',
              fontWeight: titleFontWeight,
              textAlign: titleAlign
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

Button.defaultProps = {
  onPress: undefined,
  title: 'default',
  titleColor: COLOR.WHITE,
  titleFontSize: 16,
  titleFontWeight: 'normal',
  titleAlign: undefined,
  backgroundColor: COLOR.MAIN_THEME_COLOR,
  height: 45,
  width: -1,
  radius: 5,
  style: undefined,
  type: 1,
  disabled: false
};

export default Button;
