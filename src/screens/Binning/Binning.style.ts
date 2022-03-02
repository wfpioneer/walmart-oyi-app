import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  scanContainer: {
    alignItems: 'center',
    marginVertical: 80
  },
  scanText: {
    paddingTop: 30
  },
  helperText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 15
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 1,
    width: '100%'
  },
  buttonWrapper: {
    margin: 10
  },
  icon: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5
  }
});
export default styles;
