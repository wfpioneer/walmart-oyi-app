import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  tabHeader: {
    backgroundColor: COLOR.WHITE,
    marginHorizontal: 0,
    borderBottomWidth: 2,
    paddingLeft: 10,
    borderBottomColor: COLOR.GREY_200,
    flexDirection: 'row',
    alignItems: 'center'
  },
  clear: {
    color: COLOR.MAIN_THEME_COLOR,
    paddingRight: 14,
    fontSize: 16
  },
  addText: {
    color: COLOR.MAIN_THEME_COLOR,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 25
  },
  addTextDisabled: {
    color: COLOR.DISABLED_BLUE,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 25
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
    borderRadius: 20,
    borderWidth: 2
  }
});

export default styles;
