import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    alignContent: 'flex-start'
  },
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
  ohInput: {
    color: COLOR.MAIN_THEME_COLOR,
    minWidth: '15%',
    textAlign: 'center',
    height: 40
  },
  invalidLabel: {
    fontSize: 10,
    color: COLOR.RED_900,
    marginBottom: 12
  },
  ohLabel: {
    fontSize: 18,
    paddingVertical: 4
  },
  saveBtn: {
    width: '100%',
    marginTop: 16
  }
});

export default styles;
