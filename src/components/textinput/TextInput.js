import PropTypes from 'prop-types';
import * as React from 'react';
import {
  Animated,
  TextInput as NativeTextInput,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { COLOR } from '../../themes/Color';
import styles from './TextInput.style';

const AnimatedText = Animated.createAnimatedComponent(Text);

const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -30;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 8;
const FOCUS_ANIMATION_DURATION = 150;
const BLUR_ANIMATION_DURATION = 180;
const LABEL_PADDING_HORIZONTAL = 16;
const RANDOM_VALUE_TO_CENTER_LABEL = 20;

class TextInputComponent extends React.Component {
  /**
   * Available props
   *
   * disabled - disables the text input. Gives it a dark grey outline. Default - false
   *
   * error - whether there is an error in the user's input. Gives the text input a red outline.
   *         Default - false
   *
   * errorMessage - string containing an error message.
   *
   * multiline - whether or not the input has more than one line. Default - false
   *
   * editable - is the text able to be changed by the user? Default - true
   *
   * render - the text input to render this onto. Default is the react default text input.
   *
   * -- Takes in all props of standard react text input.
   */
  static propTypes = {
    value: PropTypes.string.isRequired,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    errorLabel: PropTypes.string,
    selectionColor: PropTypes.string.isRequired,
    style: PropTypes.any.isRequired,
    render: PropTypes.any,
    multiline: PropTypes.bool,
    isShowError: PropTypes.bool,
    errorMessage: PropTypes.string,
    editable: PropTypes.bool,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func.isRequired
  };

  static defaultProps = {
    disabled: false,
    error: false,
    errorMessage: '',
    multiline: false,
    editable: true,
    isShowError: false,
    errorLabel: '',
    placeholder: '',
    onBlur: () => { },
    onFocus: () => { },
    render: props => <NativeTextInput {...props} />
  };

  constructor(props) {
    super(props);
    const { value, error, placeholder } = this.props;

    this.state = {
      labeled: new Animated.Value(value || error ? 0 : 1),
      error: new Animated.Value(error ? 1 : 0),
      focused: false,
      placeholder: error ? placeholder : '',
      value,
      labelLayout: {
        measured: false,
        width: 0
      }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value:
        typeof nextProps.value !== 'undefined'
          ? nextProps.value
          : prevState.value
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { error, label } = this.props;
    const { focused, value } = this.state;
    if (
      prevState.focused !== focused
      || prevState.value !== value
      || prevProps.error !== error
    ) {
      // The label should be minimized if the text input is focused, or has text
      // In minimized mode, the label moves up and becomes small
      if (this.validate(value, focused, error)) {
        this.minmizeLabel();
      } else {
        this.restoreLabel();
      }
    }

    if (
      prevState.focused !== focused
      || prevProps.label !== label
      || prevProps.error !== error
    ) {
      // Show placeholder text only if the input is focused, or has error, or there's no label
      // We don't show placeholder if there's a label because the label acts as placeholder
      // When focused, the label moves up, so we can show a placeholder
      if (focused || error || !label) {
        this.showPlaceholder();
      } else {
        this.hidePlaceholder();
      }
    }

    if (prevProps.error !== error) {
      // When the input has an error, we wiggle the label and apply error styles
      if (error) {
        this.showError();
      } else {
        this.hideError();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this.root && this.root.setNativeProps(...args);
  }

  showPlaceholder = () => {
    const { placeholder } = this.props;
    clearTimeout(this.timer);

    // Set the placeholder in a delay to offset the label animation
    // If we show it immediately, they'll overlap and look ugly
    this.timer = setTimeout(
      () => this.setState({
        placeholder
      }),
      50,
    );
  };

  hidePlaceholder = () => this.setState({
    placeholder: ''
  });

  showError = () => {
    const { error } = this.state;
    Animated.timing(error, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
      useNativeDriver: true
    }).start(this.showPlaceholder);
  };

  hideError = () => {
    const { error } = this.state;
    Animated.timing(error, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
      useNativeDriver: true
    }).start();
  };

  restoreLabel = () => {
    const { labeled } = this.state;
    Animated.timing(labeled, {
      toValue: 1,
      duration: FOCUS_ANIMATION_DURATION,
      useNativeDriver: true
    }).start();
  };

  minmizeLabel = () => {
    const { labeled } = this.state;
    Animated.timing(labeled, {
      toValue: 0,
      duration: BLUR_ANIMATION_DURATION,
      useNativeDriver: true
    }).start();
  };

  handleFocus = (...args) => {
    const { disabled, onFocus } = this.props;
    if (disabled) {
      return;
    }

    this.setState({ focused: true });

    if (onFocus) {
      onFocus(...args);
    }
  };

  handleBlur = (...args) => {
    const { disabled, onBlur } = this.props;
    if (disabled) {
      return;
    }

    this.setState({ focused: false });

    if (onBlur) {
      onBlur(...args);
    }
  };

  handleChangeText = value => {
    const { editable, onChangeText } = this.props;
    if (!editable) {
      return;
    }

    this.setState({ value });
    if (onChangeText) {
      onChangeText(value);
    }
  };

  generateErrorView = (isShowError, errorLabel) => (isShowError ? (
    <View style={styles.errorTxtLabel}>
      <Text style={styles.errorTxt}>{errorLabel}</Text>
    </View>
  ) : null);

  validate = (value, focused, error) => value || focused || error

  errorColor = error => (error ? COLOR.ORANGE_LOWLIGHT : COLOR.MAIN_THEME_COLOR)
  /**
   * Focuses the input.
   */
  focus() {
    return this.root && this.root.focus();
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this.root && this.root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this.root && this.root.clear();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this.root && this.root.blur();
  }

  hasActiveOutline = (focused, error) => focused || error;

  outputRange = (value, error) => (value && error ? LABEL_WIGGLE_X_OFFSET : 0)

  borderBottomWidth = hasActiveOutline => (hasActiveOutline ? 2 : 1)

  opacity = (value, focused, labelLayoutMeasure) => {
    if (value || focused) {
      return (labelLayoutMeasure ? 1 : 0);
    }
    return 1;
  }

  render() {
    const {
      disabled,
      label,
      error,
      errorLabel,
      selectionColor,
      style,
      render,
      multiline,
      isShowError,
      ...rest
    } = this.props;

    const {
      focused, labeled, labelLayout, value
    } = this.state;

    // const fontFamily = 'Roboto-Regular';
    const hasActiveOutline = this.hasActiveOutline(focused, error);
    const backgroundColor = COLOR.WHITE;

    let inputTextColor;

    let activeColor;

    let outlineColor;

    let placeholderColor;

    let containerStyle;

    if (disabled) {
      inputTextColor = COLOR.LIGHT_GRAY;
      activeColor = COLOR.LIGHT_GRAY;
      placeholderColor = COLOR.MODERATE_BLACK;
      outlineColor = COLOR.MODERATE_BLACK;
    } else {
      inputTextColor = COLOR.GREY_900;
      activeColor = this.errorColor(error);
      placeholderColor = COLOR.MODERATE_BLACK;
      outlineColor = COLOR.MODERATE_BLACK;
    }

    const labelHalfWidth = labelLayout.width / 2;
    const baseLabelTranslateX = (1 - MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE)
      * labelHalfWidth;

    const labelStyle = {
      // fontFamily,
      fontSize: MAXIMIZED_LABEL_FONT_SIZE,
      transform: [
        {
          // Wiggle the label when there's an error
          translateX: this.state.error.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, this.outputRange(value, error), 0]
          })
        },
        {
          // Move label to top
          translateY: labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [OUTLINE_MINIMIZED_LABEL_Y_OFFSET, 0]
          })
        },
        {
          // Make label smaller
          scale: labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [
              MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE,
              1
            ]
          })
        },
        {
          // Offset label scale since RN doesn't support transform origin
          translateX: labeled.interpolate({
            inputRange: [0, 1],
            outputRange: [
              baseLabelTranslateX
              - labelHalfWidth / LABEL_PADDING_HORIZONTAL
              - RANDOM_VALUE_TO_CENTER_LABEL,
              0
            ]
          })
        }
      ]
    };

    return (
      // Render the outline separately from the container
      // This is so that the label can overlap the outline
      // Otherwise the border will cut off the label on Android
      <View>
        <View style={[containerStyle, style]}>
          <View
            pointerEvents="none"
            style={[
              styles.outline,
              {
                borderRadius: 4,
                borderBottomWidth: this.borderBottomWidth(hasActiveOutline),
                borderBottomColor: hasActiveOutline
                  ? activeColor
                  : outlineColor
              }
            ]}
          />
          {label ? (
            <AnimatedText
              pointerEvents="none"
              style={[
                styles.outlinedLabelBackground,
                {
                  backgroundColor,
                  // fontFamily,
                  fontSize: MINIMIZED_LABEL_FONT_SIZE,
                  color: hasActiveOutline ? activeColor : outlineColor,
                  // Hide the background when scale will be 0
                  // There's a bug in RN which makes scale: 0 act weird
                  opacity: labeled.interpolate({
                    inputRange: [0, 0.9, 1],
                    outputRange: [1, 0, 0]
                  }),
                  transform: [
                    {
                      // Animate the scale when label is moved up
                      scaleX: labeled.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0]
                      })
                    }
                  ]
                }
              ]}
              numberOfLines={1}
            >
              {label}
            </AnimatedText>
          ) : null}

          {label ? (
            // Position colored placeholder and gray placeholder on top of each other
            // and crossfade them.
            // This gives the effect of animating the color, but allows us to use native driver
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                backgroundColor,
                {
                  opacity:
                    // Hide the label in minimized state until we measure it's width
                    // eslint-disable-next-line no-nested-ternary
                    this.opacityValue(value, focused, labelLayout.measured)
                }
              ]}
            >
              <AnimatedText
                onLayout={e => this.setState({
                  labelLayout: {
                    width: e.nativeEvent.layout.width,
                    measured: true
                  }
                })}
                style={[
                  styles.placeholder,
                  styles.placeholderOutlined,
                  backgroundColor,
                  labelStyle,
                  {
                    color: activeColor,
                    opacity: labeled.interpolate({
                      inputRange: [0, 1],
                      outputRange: [hasActiveOutline ? 1 : 0, 0]
                    })
                  }
                ]}
                numberOfLines={1}
              />
              <AnimatedText
                style={[
                  styles.placeholder,
                  styles.placeholderOutlined,
                  labelStyle,
                  {
                    color: placeholderColor,
                    opacity: hasActiveOutline || value ? labeled : 1
                  }
                ]}
                numberOfLines={1}
              >
                {label}
              </AnimatedText>
            </View>
          ) : null}

          {render({
            ...rest,
            ref: c => {
              this.root = c;
            },
            onChangeText: this.handleChangeText,
            // eslint-disable-next-line react/destructuring-assignment
            placeholder: label
              ? this.state.placeholder
              : this.props.placeholder,
            placeholderTextColor: placeholderColor,
            editable: !disabled,
            selectionColor:
              typeof selectionColor === 'undefined'
                ? activeColor
                : selectionColor,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
            multiline,
            style: [
              styles.input,
              styles.inputOutlined,
              {
                color: inputTextColor,
                // fontFamily,
                textAlignVertical: multiline ? 'top' : 'center'
              }
            ]
          })}
        </View>
        {this.generateErrorView(isShowError, errorLabel)}
      </View>
    );
  }
}

export default TextInputComponent;
