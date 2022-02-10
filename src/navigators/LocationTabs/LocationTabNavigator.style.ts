import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  tabHeader: {
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_200,
    flexDirection: 'row'
  },
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end'
  },
  disabledContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    opacity: 0.2
  },
  clear: {
    color: COLOR.MAIN_THEME_COLOR,
    paddingRight: 14,
    fontSize: 14
  },
  add: {
    color: COLOR.MAIN_THEME_COLOR,
    paddingLeft: 14,
    fontSize: 14
  },
  tabHeaderText: {
    flex: 1,
    fontSize: 18
  },
  pipe: {
    color: COLOR.GREY_600,
    fontSize: 14
  },
  confirmationView: {
    flexDirection: 'column'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
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
  errorText: {
    fontSize: 16,
    textAlign: 'center'
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  }
});

export default styles;
