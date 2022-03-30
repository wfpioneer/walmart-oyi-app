import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  scanContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
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
    width: '60%',
    paddingTop: 20
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
