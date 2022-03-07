import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scanView: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    width: '95%',
    borderTopColor: COLOR.GRAY,
    borderTopWidth: 1
  },
  scanText: {
    fontSize: 20
  }
});

export default styles;
