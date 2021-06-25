import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28
  },
  popUpContainer: {
    paddingVertical: 15,
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center'
  },
  listContainer: {
    paddingVertical: 20,
    minHeight: 80
  },
  listText: {
    alignSelf: 'center'
  },
  failedItemText: {
    paddingVertical: 20
  },

  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.RED_300,
    width: '95%',
    borderRadius: 4,
    height: 40,
    marginVertical: 10
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center'
  }
});
export default styles;
