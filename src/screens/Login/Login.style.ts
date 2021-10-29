import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInButton: {
    height: 40,
    width: '85%'
  },
  versionDisplay: {
    width: '100%',
    textAlign: 'center',
    color: COLOR.GREY_500,
    marginBottom: 20
  }
});
