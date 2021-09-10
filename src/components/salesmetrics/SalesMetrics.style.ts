import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_100
  },
  averageContainer: {
    alignItems: 'center',
    padding: 8,
    marginTop: 12
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12
  },
  averageQtyNbr: {
    fontSize: 32
  },
  averageQtyLabel: {
    fontSize: 12,
    color: COLOR.GREY_600
  },
  chartContainer: {
    height: 200,
    paddingVertical: 16
  },
  barChartSize: {
    flex: 1
  },
  axisPosition: {
    marginTop: 10
  },
  dailyButton: {
    marginRight: 4
  },
  weeklyButton: {
    marginLeft: 4
  }
});

export default styles;
