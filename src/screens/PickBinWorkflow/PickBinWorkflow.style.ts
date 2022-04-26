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
  picklistActionView: {
    flexDirection: 'column',
    marginTop: 'auto',
    width: '100%',
    borderTopColor: COLOR.GREY_400,
    borderTopWidth: 2
  },
  picklistActionButton: {
    margin: 10
  },
  continueActionHeader: {
    margin: 5
  }
});

export default styles;
