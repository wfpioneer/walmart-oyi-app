import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const center = 'center';
export default StyleSheet.create({
  mainContainer: {
    backgroundColor: COLOR.WHITE
  },
  container: {
    alignItems: center,
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  content: {
    flex: 1,
    justifyContent: center,
    alignItems: center
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  mandatoryLocScan: {
    fontSize: 16,
    color: COLOR.RED_400,
    fontWeight: 'bold'
  },
  locScanned: {
    fontSize: 16,
    color: COLOR.GREEN,
    fontWeight: 'bold'
  },
  pallet: {
    fontSize: 12,
    marginTop: 1
  },
  mandatoryPalletScan: {
    fontSize: 12,
    color: COLOR.RED_400,
    marginTop: 1
  },
  palletScanned: {
    fontSize: 12,
    color: COLOR.GREEN,
    marginTop: 1
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: center
  },
  errorText: {
    fontSize: 14,
    color: COLOR.RED_700,
    textAlign: center,
    paddingBottom: 5
  }
});
