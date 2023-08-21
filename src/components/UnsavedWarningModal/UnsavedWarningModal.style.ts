import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    height: 80,
    elevation: 10
  },
  buttonAlign: {
    alignSelf: 'center',
    width: '40%',
    margin: 10
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    padding: 15
  },
  labelHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: COLOR.RED_500,
    paddingBottom: 5
  }
});

export default styles;
