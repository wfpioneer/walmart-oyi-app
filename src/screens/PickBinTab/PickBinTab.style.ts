import { Dimensions, StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  scanItemLabel: {
    alignItems: 'center',
    backgroundColor: COLOR.GREY_200,
    padding: 10
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200
  },
  sheetContainer: {
    flexDirection: 'row',
    height: 45
  },
  touchableOpacity: {
    borderColor: COLOR.GREY_200,
    borderWidth: 1,
    width,
    flexDirection: 'row'
  },
  textView: {
    justifyContent: 'center',
    flex: 1
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  }
});

export default styles;
