import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 5,
    marginTop: 10,
    paddingHorizontal: 15
  },
  headerTitle: {
    color: COLOR.GREY_700,
    fontSize: 14
  },
  numberOfItems: {
    color: COLOR.GREY_700,
    fontSize: 12
  }
});
