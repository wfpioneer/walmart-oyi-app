import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1
  },
  firstLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  infoContainer: {
    flexDirection: 'column',
    margin: 10,
    flex: 4
  },
  lastLocationContainer: {
    backgroundColor: COLOR.YELLOW
  },
  icon: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
    margin: 10,
    flex: 1
  },
  emptyPalletMsg: {
    color: COLOR.RED_500
  }
});
