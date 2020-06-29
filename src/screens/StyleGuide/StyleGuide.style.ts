import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  bottomSeparator: {
    backgroundColor: COLOR.GRAY,
    marginTop: 10,
    height: 3,
    width: '100%'
  },
  component: {
    flex: 1
  },
  componentContainer: {
    marginHorizontal: 15
  },
  componentHeader: {
    marginTop: 10
  },
  componentHeaderText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1
  }
});
