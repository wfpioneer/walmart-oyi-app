import React from 'react';
import {
  Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import COLOR from '../../themes/Color';
import styles from './Title.styles';
/**
 * According to the Android style component, when the onLeftPress method is set,
 * the left return arrow will be displayed. When the onRightPress method is set,
 * the menu icon on the right will be displayed.
 */
export interface Props {
  height?: number;
  statusBarBgColor?: string;
  backgroundColor?: string;
  title: string;
  titleColor?: string;
  titleFontSize?: number;
  onLeftPress?: () => void;
  onLeftPressIcon?: any;
  onRightPress?: () => void;
  onRightPressIcon?: any;
}

export default class Title extends React.PureComponent<Props> {
  static defaultProps = {
    height: 55,
    statusBarBgColor: COLOR.MAIN_THEME_COLOR,
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    title: 'title',
    titleColor: COLOR.WHITE,
    titleFontSize: 18,
    onLeftPress: undefined,
    onRightPress: undefined
  };

  onLeftPress = (): void => {
    const { onLeftPress } = this.props;
    if (onLeftPress) onLeftPress();
  };

  onRightPress = (): void => {
    const { onRightPress } = this.props;
    if (onRightPress) onRightPress();
  };

  render() {
    const {
      titleColor, titleFontSize, statusBarBgColor, title,
      height, backgroundColor, onRightPress, onLeftPressIcon, onLeftPress, onRightPressIcon
    } = this.props;
    const leftButton = onLeftPress
      ? (
        <TouchableOpacity onPress={this.onLeftPress}>
          <View style={styles.buttonViewContainer}>
            <Image
              style={styles.iconSize}
              source={onLeftPressIcon || require('../../assets/images/back_icon.png')}
            />
          </View>
        </TouchableOpacity>
      )
      : null;
    const rightButton = onRightPress
      ? (
        <TouchableOpacity onPress={this.onRightPress}>
          <View style={styles.buttonViewContainer}>
            <Image
              style={styles.iconSizeRight}
              source={onRightPressIcon || require('../../assets/images/menu.png')}
            />
          </View>
        </TouchableOpacity>
      ) : null;
    return (
      <SafeAreaView style={{ backgroundColor, height }}>
        <StatusBar backgroundColor={statusBarBgColor} barStyle="light-content" />
        <View
          style={[{ backgroundColor }, styles.mainContainer]}
        >
          {leftButton}
          <Text
            style={[styles.titleText, { color: titleColor, fontSize: titleFontSize }]}
          >
            {title}
          </Text>
          {rightButton}
        </View>
      </SafeAreaView>
    );
  }
}
