import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'column'
  },
  scanTextView: {
    backgroundColor: COLOR.MID_GREY,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    padding: 7
  },
  scanText: {
    fontSize: 16
  }
});

export default styles;
