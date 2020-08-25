import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

export default StyleSheet.create({
  flatList: {
    backgroundColor: COLOR.WHITE
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
    height: 40
  },
  printerDescription: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 1,
    width: '100%'
  }
});
