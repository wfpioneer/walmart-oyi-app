import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  staticHeader: {
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginHorizontal: 0,
    zIndex: 2,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_200
  },
  areas: {
    color: COLOR.GREY_500,
    fontSize: 12
  }
});

export default styles;
