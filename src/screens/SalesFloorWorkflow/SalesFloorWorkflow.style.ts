import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  actionButtonsView: {
    flexDirection: 'row',
    marginTop: 'auto',
    width: '100%',
    borderTopColor: COLOR.GREY_400,
    borderTopWidth: 2
  },
  actionButton: {
    flex: 1,
    margin: 5
  },
  updateQuantityTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  updateQuantityText: {
    fontSize: 13
  }
});

export default styles;
