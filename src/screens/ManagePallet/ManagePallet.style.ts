import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1
  },
  disabledContainer: {
    flex: 1,
    opacity: 0.2,
    backgroundColor: COLOR.BLACK_TRANSPARENT_200
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 5,
    marginBottom: 5
  },
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  headerItemText: {
    fontSize: 15
  },
  instructionLabel: {
    borderColor: COLOR.BLACK,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    alignItems: 'center'
  },
  instructionLabelText: {
    fontSize: 16
  },
  deletedBanner: {
    backgroundColor: COLOR.DEEP_RED,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  deleteBannerText: {
    fontSize: 16,
    color: COLOR.WHITE
  },
  bodyContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    marginTop: 5
  },
  buttonContainer: {
    flex: 0.1,
    marginBottom: 20
  },
  undoText: {
    fontSize: 16,
    color: COLOR.WHITE,
    textDecorationLine: 'underline'
  },
  saveButton: {
    marginVertical: 10,
    marginHorizontal: 20,
    paddingBottom: 20,
    height: '140%'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  },
  errorLabel: {
    color: COLOR.RED_500,
    textAlign: 'center'
  },
  buttonWarningContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    height: 60,
    elevation: 10
  },
  buttonAlign: {
    alignSelf: 'center',
    width: '40%',
    marginHorizontal: 10
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    padding: 10
  },
  labelHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: COLOR.RED_500,
    paddingBottom: 5
  },
  scanContainer: {
    flexDirection: 'column',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  scanText: {
    paddingTop: 20
  }
});
