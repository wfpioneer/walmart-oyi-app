import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export const ITEM_CARD_HEIGHT = 100;
export const ITEM_CARD_SEPARATOR_HEIGHT = 2;
export const CATEGORY_HEADER_HEIGHT = 50;

export default StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: COLOR.GREY_700,
    backgroundColor: COLOR.WHITE,
    height: CATEGORY_HEADER_HEIGHT
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLOR.WHITE,
    height: ITEM_CARD_HEIGHT,
    marginBottom: ITEM_CARD_SEPARATOR_HEIGHT,
    flexDirection: 'row'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
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
