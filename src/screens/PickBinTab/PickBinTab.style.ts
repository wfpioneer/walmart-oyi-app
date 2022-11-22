import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE
  },
  scanItemLabel: {
    alignItems: 'center',
    backgroundColor: COLOR.GREY_200,
    padding: 10
  },
  buttonStyle: {
    width: '100%',
    paddingBottom: 4
  }
});

export default styles;
