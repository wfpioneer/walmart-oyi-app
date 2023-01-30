import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  categoryList: {
    flex: 1
  },
  categoryFilterCard: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    height: 40
  },
  categoryFilterText: {
    width: '90%'
  },
  menuCard: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  },
  selectionView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  }
});
