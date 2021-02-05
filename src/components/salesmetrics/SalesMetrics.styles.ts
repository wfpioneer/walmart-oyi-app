import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_100
  },
  averageContainer: {
    alignItems: 'center',
    padding: 8,
    marginTop: 12
  },
  listContainer: {
    paddingHorizontal: 10
  },
  listRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopColor: COLOR.GREY_300
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12
  },
  averageQtyNbr: {
    fontSize: 32
  },
  averageQtyLabel: {
    fontSize: 12,
    color: COLOR.GREY_600
  }
});

export default styles;
