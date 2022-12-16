import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  textAreaContainer: {
    borderColor: COLOR.GREY,
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150
  },
  buttonContainer: {},
  submitButton: {}
});
