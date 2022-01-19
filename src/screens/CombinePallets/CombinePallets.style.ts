import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  scanContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 370
  },
  textInput: {
    paddingLeft: 10,
    color: COLOR.BLACK,
    borderWidth: 1
  },
  scanText: {
    paddingTop: 30
  },
  orText: {
    paddingTop: 20
  },
  textView: {
    width: 200,
    paddingTop: 20
  }
});

export default styles;
