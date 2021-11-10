import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4
  },
  updateContainerValid: {
    borderColor: COLOR.GREY_300
  },
  updateContainerInvalid: {
    borderColor: COLOR.RED_900
  },
  input: {
    color: COLOR.MAIN_THEME_COLOR,
    minWidth: '15%',
    textAlign: 'center',
    height: 40
  }
});

export default styles;
