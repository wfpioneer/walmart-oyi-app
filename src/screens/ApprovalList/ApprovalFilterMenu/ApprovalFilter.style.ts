import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

const FLEX_START = 'flex-start';

export default StyleSheet.create({
  arrowView: {
    flex: 0.1
  },
  categoryList: {
    flex: 1
  },
  categoryFilterCard: {
    alignItems: 'center',
    justifyContent: FLEX_START,
    flexDirection: 'row',
    flex: 1,
    height: 40
  },
  categoryFilterText: {
    width: '90%'
  },
  clearButton: {
    flex: 0.5,
    marginRight: 15
  },
  clearText: {
    color: COLOR.WHITE,
    textAlign: 'right'
  },
  headerBar: {
    alignItems: 'center',
    justifyContent: FLEX_START,
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    flexDirection: 'row',
    height: 60,
    width: '100%'
  },
  menuContainer: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
    alignItems: FLEX_START,
    justifyContent: FLEX_START
  },
  menuCard: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  },
  menuCardText: {
    flex: 1,
    justifyContent: 'center'
  },
  refineText: {
    color: COLOR.WHITE,
    flex: 1,
    marginLeft: 15
  },
  selectionView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  subtitleText: {
    color: COLOR.GREY_500,
    fontSize: 12
  }
});
