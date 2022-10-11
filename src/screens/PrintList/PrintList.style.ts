import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  footerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 16
  },
  footerBtn: {
    flex: 1,
    paddingHorizontal: 6
  },
  printerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  printTextPadding: {
    paddingLeft: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  printerName: {
    fontSize: 14,
    paddingLeft: 5,
    paddingTop: 4,
    color: COLOR.BLACK
  },
  changeButton: {
    fontSize: 14,
    color: COLOR.MAIN_THEME_COLOR,
    paddingRight: 10
  },
  buttonView: {
    flexDirection: 'row'
  },
  itemText: {
    paddingLeft: 10,
    borderBottomWidth: 1,
    fontSize: 16
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 28
  },
  emptyText: {
    marginVertical: 16,
    color: COLOR.GREY_700
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: COLOR.RED,
    alignSelf: 'center',
    fontSize: 14
  }
});

export default styles;
