import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLOR.WHITE,
    padding: 8
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 24
  },
  nbrContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'stretch'
  },
  nbrDivider: {
    marginHorizontal: 8,
    color: COLOR.GREY_700,
    fontSize: 12
  },
  exceptionText: {
    color: COLOR.PINK,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    fontSize: 12
  },
  itemNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4
  },
  itemNbrText: {
    color: COLOR.GREY_700,
    fontSize: 12
  },
  upcNbrText: {
    color: COLOR.GREY_700,
    fontSize: 12
  },
  statusText: {
    marginBottom: 4,
    color: COLOR.GREY_700,
    fontSize: 12
  },
  catgText: {
    marginBottom: 4,
    color: COLOR.GREY_700,
    fontSize: 12
  },
  priceText: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16
  },
  printPriceBtn: {
    marginVertical: 10
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  contentText: {
    fontSize: 12,
    paddingVertical: 2
  },
  ViewPadding: {
    paddingHorizontal: 5
  }
});

export default styles;
