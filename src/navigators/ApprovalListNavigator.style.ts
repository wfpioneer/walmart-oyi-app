import { StyleSheet } from 'react-native';
import COLOR from '../themes/Color';

const styles = StyleSheet.create({
  headerTitle: {
    color: COLOR.WHITE,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: -2
  },
  headerSubtitle: {
    color: COLOR.WHITE,
    fontSize: 14,
    marginLeft: -2
  },
  headerRightView: {
    paddingRight: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  headerLeftPadding: {
    paddingLeft: 10
  },
  headerContainer: { // Double check
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15
  },
  selectAllText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default styles;
