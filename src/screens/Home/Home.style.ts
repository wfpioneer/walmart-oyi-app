import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

export default StyleSheet.create({
  activityIndicator: {
    marginTop: 10
  },
  container: {
    alignItems: 'center',
    // flex: 1,
    justifyContent: 'center'
  },
  pingGoogleButton: {
    marginTop: 20,
    width: '80%'
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  horizontalContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  errorText: {
    paddingVertical: 10,
    width: '95%',
    textAlign: 'center'
  },
  errorRetryButton: {
    backgroundColor: COLOR.RED_500,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '95%'
  }
});
