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
  bottomSheetView: {
    flexDirection: 'column'
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  }
});

export default styles;
