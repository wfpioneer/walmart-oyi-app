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
  headerRightPadding: {
    paddingRight: 16
  },
  headerLeftPadding: {
    paddingLeft: 10
  },
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  selectAllButton: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  selectAllText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default styles;
