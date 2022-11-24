import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  menuContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: COLOR.HAVELOCK_BLUE,
    padding: 10
  },
  menuSelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: COLOR.HAVELOCK_BLUE,
    paddingVertical: 5
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    flex: 1,
    fontSize: 16
  },
  arrowPadding: {
    paddingRight: 10
  }
});

export default styles;
