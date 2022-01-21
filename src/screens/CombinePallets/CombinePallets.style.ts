import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  scanContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30
  },
  scanView: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLOR.GREY_600
  },
  scanText: {
    fontSize: 18
  },
  palletContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  palletInfoHeader: {
    paddingHorizontal: 20,
    marginVertical: 20
  },
  palletText: {
    fontSize: 18
  },
  itemText: {
    fontSize: 14
  },
  mergeText: {
    alignSelf: 'center',
    fontSize: 16
  },
  saveButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  }
});

export default styles;
