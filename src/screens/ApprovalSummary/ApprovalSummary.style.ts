import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLOR.WHITE
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 0.3,
    justifyContent: 'flex-end',
    marginHorizontal: 15
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.MIDNIGHT
  },
  quantityContainer: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'space-evenly'
  },
  itemQtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.GREY_700
  }

});

export default styles;
