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
    fontSize: 14
  },
  pipe: {
    color: COLOR.GREY_600,
    fontSize: 14
  }
});

export default styles;
