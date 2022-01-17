import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  disabledContainer: {
    flex: 1,
    opacity: 0.2,
    backgroundColor: COLOR.BLACK_TRANSPARENT_200
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  }
});

export default styles;
