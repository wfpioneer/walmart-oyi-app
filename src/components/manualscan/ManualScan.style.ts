import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLOR.WHITE,
    paddingRight: 16
  },
  textInput: {
    flex: 1
  }
});

export default styles;
