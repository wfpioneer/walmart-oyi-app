import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_200
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  detailsText: {
    fontSize: 16,
    alignSelf: 'center'
  }
});

export default styles;
