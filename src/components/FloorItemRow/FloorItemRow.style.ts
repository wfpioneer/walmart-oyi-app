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
    lineHeight: 22,
    flex: 1
  },
  itemDesc: {
    lineHeight: 22
  },
  price: {
    color: COLOR.GREY_500,
    lineHeight: 22
  },
  pallet: {
    flexDirection: 'row'
  },
  rightButton: {
    paddingVertical: 3,
    paddingRight: 10
  },
  leftButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 25,
    height: 20,
    backgroundColor: COLOR.WHITE
  },
  itemImage: {
    height: 70,
    width: 70
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});
