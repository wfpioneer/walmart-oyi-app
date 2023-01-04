import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

export default StyleSheet.create({
  activityIndicator: {
    marginTop: 10
  },
  container: {
    alignItems: 'center',
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
  },
  versionDisplay: {
    width: '100%',
    textAlign: 'center',
    color: COLOR.GREY_500
  },
  modalContainer: {
    width: '100%'
  },
  barcodeErrorContainer: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.TRACKER_GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
    minHeight: 150
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  iconPosition: {
    alignSelf: 'center'
  },
  dismissButton: {
    width: '70%',
    marginTop: 16
  },
  barcodeErrorText: {
    fontSize: 16,
    textAlign: 'center'
  },
  actionRow: {
    flexDirection: 'row'
  },
  descriptionText: {
    padding: 15,
    textAlign: 'center'
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5
  }
});
