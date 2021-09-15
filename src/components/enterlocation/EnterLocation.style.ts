import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  scanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLOR.WHITE,
    paddingRight: 16
  },
  textInput: {
    flex: 1,
    paddingLeft: 10
  },
  buttonWidth: {
    width: '100%'
  }
});

export default styles;
