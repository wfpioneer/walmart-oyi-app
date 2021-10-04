import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 2,
    flexDirection: 'row'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flex: 1
  },
  itemNbr: {
    color: COLOR.GREY_500,
    fontSize: 12,
    lineHeight: 22
  },
  palletId: {
    color: COLOR.GREY_500,
    fontSize: 12,
    lineHeight: 22
  },
  palletCreateTs: {
    color: COLOR.GREY_500,
    fontSize: 12,
    lineHeight: 22
  },
  itemDesc: {
    lineHeight: 22
  },
  price: {
    color: COLOR.GREY_500,
    lineHeight: 22
  }
});
