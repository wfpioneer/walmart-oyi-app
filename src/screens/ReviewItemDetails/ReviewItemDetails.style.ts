import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

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
  locationContainer: {
    paddingHorizontal: 8
  },
  locationDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_100,
    paddingVertical: 14
  },
  scanForNoActionButton: {
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    borderRadius: 4,
    borderColor: COLOR.MAIN_THEME_COLOR,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 15
  },
  buttonText: {
    color: COLOR.WHITE,
    textAlign: 'center',
    marginLeft: 10
  },
  picklistSuccessText: {
    color: COLOR.GREEN
  },
  picklistErrorView: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  picklistErrorText: {
    color: COLOR.RED_500
  },
  itemOnOrderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  renderPickListContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK_TRANSPARENT_600
  },
  barcodeErrorContainer: {
    width: '80%',
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
  labelIcon: {
    marginLeft: -4
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  historyMoreBtn: {
    width: 60
  },
  moreBtnContainer: {
    backgroundColor: COLOR.WHITE
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLOR.WHITE
  },
  historyContainer: {
    marginTop: 8
  },
  reserveLoc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingLeft: 2,
    paddingRight: 3,
    paddingVertical: 3
  },
  replenishmentContainer: {
    backgroundColor: COLOR.WHITE,
    padding: 5
  },
  replenishmentHistory: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_200
  },
  replenishmentOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_200
  }
});

export default styles;
