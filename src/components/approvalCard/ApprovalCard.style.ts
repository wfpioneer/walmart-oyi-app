import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLOR.WHITE,
    flexDirection: 'column',
    marginBottom: 4,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 14,
    flex: 1
  },
  itemInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  image: {
    height: 80,
    width: 80,
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
  timeLeftDivider: {
    marginHorizontal: 4,
    color: COLOR.SHIP_COVE,
    fontSize: 14
  },
  infoColumn: {
    flexDirection: 'column'
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
