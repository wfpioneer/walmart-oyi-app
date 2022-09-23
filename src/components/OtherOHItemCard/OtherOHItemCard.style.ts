import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  otherOHDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8
  },
  mainContainer: {
    backgroundColor: COLOR.WHITE,
    width: '100%'
  },
  content: {
    padding: 8,
    textAlign: 'right'
  }
});

export default styles;
