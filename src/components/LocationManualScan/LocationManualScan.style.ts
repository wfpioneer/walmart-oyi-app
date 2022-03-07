import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLOR.WHITE,
    paddingRight: 16
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: COLOR.BLACK
  },
  alertView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 5,
    backgroundColor: COLOR.GREY_100,
    width: '95%'
  },
  errorText: {
    fontSize: 12,
    color: COLOR.RED_400,
    paddingHorizontal: 5
  },
  textInputContainer: {
    flexDirection: 'row'
  }
});

export default styles;
