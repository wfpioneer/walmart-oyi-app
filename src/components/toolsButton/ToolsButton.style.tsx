import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: COLOR.GREY_300,
    backgroundColor: COLOR.WHITE
  },
  title: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6
  }
});

export default styles;
