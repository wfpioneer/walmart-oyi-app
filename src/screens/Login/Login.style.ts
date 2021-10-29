import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  signInButton: {
    height: 40,
    width: '85%'
  },
  versionDisplay: {
    width: '100%',
    textAlign: 'center',
    color: COLOR.GREY_500,
    marginTop: 20
  }
});
