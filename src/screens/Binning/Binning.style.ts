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
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 20,
    borderWidth: 2
  },
  checkBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '75%',
    marginTop: 2
  },
  checkBoxView: {
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkBoxTextView: {
    justifyContent: 'center',
    flex: 1
  },
  checkBoxText: {
    fontSize: 18
  }
});
export default styles;
