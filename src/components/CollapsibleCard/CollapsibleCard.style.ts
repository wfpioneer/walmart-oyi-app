import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  menuContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    backgroundColor: COLOR.HAVELOCK_BLUE
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleText: {
    fontSize: 16
  },
  arrowView: {
    flex: 0.1,
    paddingLeft: 5
  }
});

export default styles;
