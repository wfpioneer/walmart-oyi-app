import { Dimensions, StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const { width } = Dimensions.get('window');
const buttonScale = 6;
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 7,
    margin: 2
  },
  input: {
    width: (4 * width) / buttonScale + 4,
    height: width / (buttonScale + 1),
    fontSize: 20,
    textAlign: 'right'
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
  equalBtn: {
    width: (2 * width) / buttonScale
  },
  calcButtonText: {
    fontSize: 30,
    color: COLOR.WHITE
  },
  errorText: {
    fontSize: 16,
    color: COLOR.RED_700,
    paddingHorizontal: 10
  },
  highlightedErrorText: {
    fontSize: 16,
    color: COLOR.WHITE,
    backgroundColor: COLOR.RED,
    paddingHorizontal: 10
  },
  calcPaperTape: {
    width: (4 * width) / buttonScale + 4,
    paddingBottom: 0,
    fontSize: 16,
    textAlign: 'right'
  }
});

export default styles;
