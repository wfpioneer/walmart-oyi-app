import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  locDetailsScreenContainer: {
    flex: 1
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28
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
  },
  container: {
    flex: 1
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});

export default styles;
