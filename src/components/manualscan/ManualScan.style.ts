import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: COLOR.WHITE,
    justifyContent: 'flex-start'
  },
  textInputContainer: {
    flexDirection: 'row'
  },
  textInput: {
    paddingLeft: 10,
    borderColor: COLOR.GREY,
    width: '90%'
  }
});

export default styles;
