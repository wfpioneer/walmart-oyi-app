/* eslint react/sort-comp: 0 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import COLOR from '../../themes/Color';

/**
 * Custom button component
 *
 */

class IconButton extends PureComponent {
  static Type = {
    PRIMARY: 1,
    SOLID_WHITE: 2,
    NO_BORDER: 3
  };

  constructor(props) {
    super(props);
    const { backgroundColor } = this.props;
    this.bgColor = backgroundColor;
  }

  onPress = () => {
    const { onPress } = this.props;
    if (onPress !== undefined) {
      onPress();
    }
  };

  render() {
    const {
      type,
      width,
      height,
      disabled,
      backgroundColor,
      radius,
      style,
      icon
    } = this.props;
    const containerStyle = width === -1
      ? { height }
      : {
        height,
        width
      };

    this.bgColor = backgroundColor;

    let buttonStyle;
    if (type === IconButton.Type.PRIMARY) {
      buttonStyle = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius,
        backgroundColor: this.bgColor,
        elevation: 1
      };
    } else if (type === IconButton.Type.SOLID_WHITE) {
      buttonStyle = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius,
        borderColor: this.bgColor,
        borderWidth: 1,
        backgroundColor: COLOR.WHITE
      };
    } else if (type === IconButton.Type.NO_BORDER) {
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
            onPress={this.onPress}
            activeOpacity={0.8}
            style={buttonStyle}
          >
            {icon}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

IconButton.propTypes = {
  onPress: PropTypes.func,
  icon: PropTypes.node,
  backgroundColor: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  radius: PropTypes.number,
  style: PropTypes.object,
  type: PropTypes.number,
  disabled: PropTypes.bool
};

IconButton.defaultProps = {
  onPress: undefined,
  title: undefined,
  backgroundColor: COLOR.MAIN_THEME_COLOR,
  height: 45,
  width: -1,
  radius: 5,
  style: undefined,
  type: 1,
  disabled: false
};

export default IconButton;
