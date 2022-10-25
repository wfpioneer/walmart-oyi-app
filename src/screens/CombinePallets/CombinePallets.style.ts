import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 10,
    width: '100%',
    borderBottomWidth: 2,
    borderColor: COLOR.GREY_600,
    paddingVertical: 10
  },
  palletText: {
    fontSize: 18
  },
  itemText: {
    fontSize: 14
  },
  mergeView: {
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLOR.GREY_600
  },
  mergeText: {
    fontSize: 16,
    paddingVertical: 12
  },
  deletePalletInfoHeader: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16
  },
  deletePalletText: {
    fontSize: 16
  },
  saveButton: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  palletScanContainer: {
    width: '100%',
    alignItems: 'center'
  },
  orText: {
    paddingVertical: 10,
    marginBottom: 14
  },
  barcodeScanContainer: {
    alignItems: 'center'
  },
  barCodeScanText: {
    paddingVertical: 10
  }
});

export default styles;
