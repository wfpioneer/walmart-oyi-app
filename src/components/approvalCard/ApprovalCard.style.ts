import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLOR.WHITE,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 4,
    padding: 8
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1
  },
  itemInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'stretch'
  },
  itemNumber: {
    color: COLOR.SHIP_COVE,
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemDesc: {
    color: COLOR.GREY_800,
    fontSize: 18,
    fontWeight: 'bold',
    width: '80%',
    alignSelf: 'center'
  },
  quantityDivider: {
    marginHorizontal: 4,
    color: COLOR.GREY_700,
    fontSize: 16
  },
  timeLeftDivider: {
    marginHorizontal: 4,
    color: COLOR.SHIP_COVE,
    fontSize: 14
  },
  quantityCalc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6
  },
  onHandsChange: {
    flexDirection: 'row'
  },
  quantityResult: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLOR.GREY_400,
    width: '100%',
    paddingTop: 5
  },
  onHandsContainer: {
    flexDirection: 'column',
    width: '100%'
  },
  checkBox: {
    justifyContent: 'center',
    marginHorizontal: 20
  },
  infoColumn: {
    flexDirection: 'column'
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
  resultText: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: COLOR.TRACKER_GREY
  },
  noOHChange: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: COLOR.TRACKER_GREY
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
  timeLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_400,
    paddingBottom: 6
  },
  userText: {
    color: COLOR.SHIP_COVE,
    fontSize: 14,
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 1
  },
  daysText: {
    color: COLOR.DEEP_RED,
    fontSize: 14,
    fontWeight: 'bold',
    flexBasis: '60%',
    flexGrow: 1,
    flexShrink: 0
  }
});

export default styles;
