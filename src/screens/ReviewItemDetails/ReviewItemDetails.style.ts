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
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  renderPickListContatiner: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8
  },
  onHandsContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  onHandsView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mgrApprovalView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  }
});

export default styles;
