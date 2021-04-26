import { StyleSheet } from 'react-native';
import COLOR from '../themes/Color';

export default StyleSheet.create({
  headerTitle: {
    color: COLOR.WHITE,
    fontWeight: 'bold',
    fontSize: 20
  },
  headerSubtitle: {
    color: COLOR.WHITE,
    fontSize: 14
  },
  headerRightPadding: {
    paddingRight: 10
  },
  headerLeftPadding: {
    paddingLeft: 10
  },
  selectAllButton: {
    flex: 1,
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
