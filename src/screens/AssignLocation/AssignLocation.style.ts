import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
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
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 1,
    width: '100%'
  }
});

export default styles;
