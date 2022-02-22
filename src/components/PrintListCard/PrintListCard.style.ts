import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
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
    justifyContent: 'space-around'
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
    color: COLOR.GREY_700
  },
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 6
  },
  itemContainerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  }
});

export default styles;
