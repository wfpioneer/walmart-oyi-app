import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: COLOR.GREY_700,
    backgroundColor: COLOR.WHITE
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLOR.WHITE,
    height: 100,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 2,
    flexDirection: 'row'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    height: 100,
    flex: 1
  },
  itemInfo: {
    fontSize: 12
  },
  itemNumber: {
    fontSize: 12,
    color: COLOR.GREY_700
  }
});
