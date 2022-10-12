import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  invalidLabel: {
    fontSize: 10,
    color: COLOR.RED_900,
    marginBottom: 12
  },
  titleLabel: {
    fontSize: 18,
    paddingVertical: 8,
    textAlign: 'center'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    display: 'flex'
  },
  button: {
    width: '50%',
    paddingHorizontal: 8
  }
});

export default styles;
