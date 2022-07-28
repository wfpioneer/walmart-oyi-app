import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.RED_300,
    borderRadius: 4,
    height: 40,
    width: '100%'
  },
  errorText: {
    marginVertical: 10,
    textAlign: 'center'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  actionButtonsView: {
    flexDirection: 'row',
    marginTop: 'auto',
    width: '100%',
    borderTopColor: COLOR.GREY_400,
    borderTopWidth: 2
  },
  actionButton: {
    flex: 1,
    margin: 5
  },
  updateQuantityTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  updateQuantityText: {
    fontSize: 13
  },
  updateExpirationTitleView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: '100%',
    backgroundColor: COLOR.HAVELOCK_BLUE,
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 8
  },
  expirationDateTextView: {
    marginTop: 10,
    borderBottomWidth: 1
  },
  expirationDateText: {
    fontSize: 18
  },
  udpateExpirationContentView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10
  },
  updateExpirationButtonsView: {
    flexDirection: 'row',
    marginTop: 30,
    width: '100%'
  },
  safeAreaView: {
    flex: 1
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  },
  disabledContainer: {
    flex: 1,
    opacity: 0.2,
    backgroundColor: COLOR.BLACK_TRANSPARENT_200
  },
  additionalItemsLabelView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  additionalItemsLabel: {
    fontSize: 13
  }
});

export default styles;
