import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.RED_300,
    borderRadius: 4,
    height: 40,
    width: '100%'
  },
  errorText: {
    marginVertical: 10,
    textAlign: 'center'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 15
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
