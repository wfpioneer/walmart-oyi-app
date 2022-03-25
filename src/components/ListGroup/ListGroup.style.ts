import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10
  },
  menuContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    backgroundColor: COLOR.TIP_BLUE
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
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
