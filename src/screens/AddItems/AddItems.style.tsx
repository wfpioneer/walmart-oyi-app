import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  scanContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  scanText: {
    paddingTop: 30
  },
  completeActivityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
