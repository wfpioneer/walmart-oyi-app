import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%'
  },
  header: {
    backgroundColor: COLOR.PALE_BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  palletInfoSelection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textRightPadding: {
    paddingRight: 10
  },
  itemList: {
    margin: 10
  }
});

export default styles;
