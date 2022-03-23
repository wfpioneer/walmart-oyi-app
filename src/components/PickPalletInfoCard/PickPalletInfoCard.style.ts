import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  header: {
    backgroundColor: COLOR.PALE_BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default styles;
