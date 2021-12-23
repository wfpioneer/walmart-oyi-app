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
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmationTextView: {
    flexDirection: 'column'
  },
  confirmationText: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5
  },
  confirmationExtraText: {
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});

export default styles;
