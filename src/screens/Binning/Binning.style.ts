import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  emptyFlatListContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  scanContainer: {
    alignItems: 'center'
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
    marginVertical: 10,
    marginHorizontal: 15
  },
  icon: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5
  },
  safeAreaView: {
    flex: 1
  },
  // Warning Modal styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    height: 80,
    elevation: 10
  },
  buttonAlign: {
    alignSelf: 'center',
    width: '40%',
    margin: 10
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    padding: 15
  },
  labelHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: COLOR.RED_500,
    paddingBottom: 5
  }
});
export default styles;
