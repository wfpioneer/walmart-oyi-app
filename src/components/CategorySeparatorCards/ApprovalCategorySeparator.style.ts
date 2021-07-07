import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: COLOR.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 4,
    paddingVertical: 20,
    elevation: 4
  },
  categoryName: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    color: COLOR.GREY_700,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 14
  },
  checkBox: {
    justifyContent: 'center',
    marginHorizontal: 7
  }
});

export default styles;
