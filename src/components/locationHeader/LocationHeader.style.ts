import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_200
  },
  headerText: {
    flexDirection: 'column'
  },
  detailsText: {
    color: COLOR.GREY_500,
    fontSize: 12
  },
  buttonText: {
    color: COLOR.MAIN_THEME_COLOR,
    fontSize: 16
  },
  disabledButton: {
    color: COLOR.DISABLED_BLUE,
    fontSize: 16
  }
});

export default styles;
