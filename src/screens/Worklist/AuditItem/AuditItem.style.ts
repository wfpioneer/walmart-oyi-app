import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  completeActivityIndicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center'
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.RED_300,
    width: '95%',
    borderRadius: 4,
    height: 40,
    marginVertical: 10
  },
  safeAreaView: {
    flex: 1
  },
  marginBottomStyle: {
    marginBottom: 6
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    paddingHorizontal: 10
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },
  footer: {
    height: 60,
    borderTopWidth: 4,
    borderTopColor: COLOR.GREY_200
  }
});

export default styles;
