import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  onHandsContainer: {
    flexDirection: 'column',
    width: '100%'
  },
  quantityHeader: {
    alignSelf: 'center',
    color: COLOR.SHIP_COVE,
    fontSize: 14
  },
  quantityText: {
    fontSize: 16,
    alignSelf: 'center',
    color: COLOR.TRACKER_GREY
  },
  quantityCalc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6
  },
  quantityDivider: {
    marginHorizontal: 4,
    color: COLOR.GREY_700,
    fontSize: 16
  },
  quantityResult: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLOR.GREY_200,
    width: '100%'
  },
  resultText: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: COLOR.TRACKER_GREY
  },
  onHandsChange: {
    flexDirection: 'row'
  },
  negativeChange: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: COLOR.RED_550,
    fontWeight: 'bold'
  },
  positiveChange: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: COLOR.GREEN,
    fontWeight: 'bold'
  },
  noOHChange: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: COLOR.TRACKER_GREY
  }
});
export default styles;
