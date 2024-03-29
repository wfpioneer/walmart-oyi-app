import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLOR.WHITE,
    padding: 15,
    marginBottom: 2,
    flexDirection: 'row'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flex: 1
  },
  itemNbr: {
    color: COLOR.GREY_700,
    fontSize: 12,
    lineHeight: 22
  },
  palletCreateTs: {
    color: COLOR.GREY_500,
    fontSize: 12
  },
  moreText: {
    color: COLOR.GREY_500,
    fontSize: 12
  },
  price: {
    color: COLOR.GREY_500,
    lineHeight: 22
  },
  itemContainer: {
    paddingLeft: 15,
    paddingTop: 15
  },
  textHeader: {
    flex: 1
  },
  pallet: {
    flexDirection: 'row'
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});
