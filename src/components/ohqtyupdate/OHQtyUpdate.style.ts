import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK_TRANSPARENT_600
  },
  contentContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 7.5,
    paddingBottom: 12,
    paddingHorizontal: 8
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
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
