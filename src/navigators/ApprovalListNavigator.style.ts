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
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  selectAllButton: {
    marginRight: 8,
    maxWidth: 150,
    minWidth: 80
  },
  selectAllText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
  filterList: {
    marginRight: 8
  }
});

export default styles;
