import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLOR.WHITE,
    alignContent: 'center',
    height: 80,
    elevation: 10
  },
  buttonAlign: {
    alignSelf: 'center',
    width: '45%'
  }
});

export default styles;
