import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import COLOR from '../../themes/Color';

/**
 * Custom button component
 *
 */

interface IconButtonPropsI {
  onPress?: () => void,
  icon: ReactNode,
  backgroundColor?: string,
  height?: number,
  width?: number,
  radius?: number,
  style?: object,
  type?: number,
  disabled?: boolean,
  // eslint-disable-next-line react/require-default-props
  testID?: string
}

// eslint-disable-next-line no-shadow
export enum IconButtonType {
  PRIMARY = 1,
  SOLID_WHITE = 2,
  NO_BORDER = 3
}

export const IconButton = (props: IconButtonPropsI) => {
  const {
    type,
    width,
    height,
    disabled,
    backgroundColor,
    radius,
    style,
    icon,
    testID
  } = props;

  const containerStyle = width === -1
    ? { height }
    : {
      height,
      width
    };
  let buttonStyle = {};
  if (type === IconButtonType.PRIMARY) {
    buttonStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius,
      backgroundColor,
      elevation: 1
    };
  } else if (type === IconButtonType.SOLID_WHITE) {
    buttonStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: radius,
      borderColor: backgroundColor,
      borderWidth: 1,
      backgroundColor: COLOR.WHITE
    };
  } else if (type === IconButtonType.NO_BORDER) {
    buttonStyle = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLOR.TRANSPARENT
    };
  }

  const onButtonPress = () => {
    const { onPress } = props;
    if (onPress !== undefined) {
      onPress();
    }
  };

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
          {icon}
        </TouchableOpacity>
      </View>
    </View>
  );
};

IconButton.defaultProps = {
  onPress: undefined,
  backgroundColor: COLOR.MAIN_THEME_COLOR,
  height: 45,
  width: -1,
  radius: 5,
  style: undefined,
  type: 1,
  disabled: false
};

export default IconButton;
