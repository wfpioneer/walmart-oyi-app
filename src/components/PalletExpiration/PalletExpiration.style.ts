import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  headerText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorLabel: {
    color: COLOR.RED_500,
    textAlign: 'center'
  },
  effectiveDateHeaderItem: {
    fontSize: 15,
    color: COLOR.BLACK,
    textAlign: 'center'
  },
  effectiveDateContainer: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center'
  },
  modifiedEffectiveDateContainer: {
    paddingHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLOR.YELLOW,
    borderWidth: 1
  }
});
