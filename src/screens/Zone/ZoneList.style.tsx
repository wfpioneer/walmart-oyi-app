import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginVertical: 1,
    marginHorizontal: 0
  },
  staticHeader: {
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginHorizontal: 0,
    zIndex: 2,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_200
  },
  title: {
    fontSize: 40
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noZones: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  areas: {
    color: COLOR.GREY_500,
    fontSize: 12
  }
});

export default styles;
