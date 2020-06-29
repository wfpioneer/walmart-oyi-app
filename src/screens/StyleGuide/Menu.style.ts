import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  flatList: {
    backgroundColor: COLOR.MIDNIGHT
  },
  menuItem: {
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  menuItemText: {
    color: COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    paddingVertical: 10,
    textAlignVertical: 'center'
  },
  separatorView: {
    backgroundColor: COLOR.WHITE,
    height: 1
  },
  touchableArea: {
    paddingHorizontal: 10
  }
});
