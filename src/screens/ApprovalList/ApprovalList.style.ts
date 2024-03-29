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
    textAlign: 'center',
    paddingHorizontal: 8
  },
  filterContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 50,
    width: '100%'
  },
  filterList: {
    paddingHorizontal: 0
  }
});
export default styles;
