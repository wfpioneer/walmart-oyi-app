import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  palletCardContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_600
  },
  textContainer: {
    flex: 1
  },
  palletText: {
    fontSize: 18
  },
  itemText: {
    fontSize: 14
  },
  trashIcon: {
    justifyContent: 'center',
    paddingHorizontal: 10
  }
});

export default styles;