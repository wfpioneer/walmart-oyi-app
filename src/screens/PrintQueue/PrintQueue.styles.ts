import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 28
  },
  container: {
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  totalCountContainer: {
    marginHorizontal: 18,
    marginVertical: 8
  },
  listContainer: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_500
  },
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 6
  },
  itemContainerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  },
  itemDetailsContainer: {
    flex: 1,
    paddingLeft: 8
  },
  itemBottomRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtnContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 6,
    paddingVertical: 12,
    elevation: 16
  },
  emptyImage: {

  },
  emptyText: {
    marginVertical: 16,
    color: COLOR.GREY_700
  },
  itemImage: {
    height: 65,
    width: 65,
    resizeMode: 'stretch'
  },
  itemDescText: {
    fontSize: 16,
    paddingBottom: 8,
    paddingRight: 14
  },
  sizeText: {
    color: COLOR.GREY_700,
    paddingTop: 4
  },
  copiesText: {
    flex: 3,
    color: COLOR.GREY_700,
  },
  actionBtns: {

  },
  footerBtn: {
    flex: 1,
    paddingHorizontal: 6
  }
});

export default styles;
