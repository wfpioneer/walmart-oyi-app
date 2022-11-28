import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

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
  }
});

export default styles;
