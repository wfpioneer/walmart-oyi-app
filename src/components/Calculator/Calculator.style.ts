import { Dimensions, StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const { width } = Dimensions.get('window');
const buttonScale = 5;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLOR.BLACK_TRANSPARENT_600,
    borderWidth: 1,
    borderRadius: 8
  },
  inputView: {
    borderBottomWidth: 1
  },
  input: {
    width: (4 * width) / buttonScale + 8,
    height: width / buttonScale,
    fontSize: 20,
    textAlign: 'center'
  },
  buttonRow: {
    flexDirection: 'row'
  },
  calcButtonView: {
    height: width / buttonScale,
    width: width / buttonScale,
    borderColor: COLOR.BLACK,
    borderWidth: 1,
    borderRadius: 7,
    margin: 1,
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calcButtonText: {
    fontSize: 30
  },
  errorText: {
    fontSize: 15,
    color: COLOR.RED_700
  },
  highlightedErrorText: {
    fontSize: 15,
    color: COLOR.WHITE,
    backgroundColor: COLOR.RED
  }
});

export default styles;
