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
  },
  safeAreaView: {
    flex: 1
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 5,
    borderWidth: 2
  },
  disabledContainer: {
    flex: 1,
    opacity: 0.2,
    backgroundColor: COLOR.BLACK_TRANSPARENT_200
  }
});

export default styles;
