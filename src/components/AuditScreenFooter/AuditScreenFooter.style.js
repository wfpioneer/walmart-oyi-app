import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '100%'
  },
  totalCntVw: {
    flex: 1,
    alignItems: 'center'
  },
  totalCnt: {
    fontWeight: '500',
    fontSize: 16
  },
  continueBtn: {
    flex: 1
  }
});
