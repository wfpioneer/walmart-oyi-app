import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    borderRadius: 20,
    flexDirection: 'row',
    height: 30,
    marginVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5
  },
  filterText: {
    color: COLOR.WHITE,
    paddingHorizontal: 10
  }
});
