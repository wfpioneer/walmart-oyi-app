import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  buttonWrapper: {
    marginVertical: 10,
    marginHorizontal: 15
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 2,
    width: '100%'
  },
  scrollViewContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: 6
  },
  marginBottomStyles: {
    marginBottom: 6
  }
});
