import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: { width: '100%', marginTop: 2 },
  container: {
    backgroundColor: COLOR.WHITE,
    width: '100%',
    padding: 5,
    flexDirection: 'row'
  },
  loaderContainer: {
    backgroundColor: COLOR.GREY_TRANSPARENT,
    padding: 5,
    flexDirection: 'row',
    height: 80
  },
  image: {
    height: 85,
    width: 85
  },
  itemDetails: {
    padding: 5,
    flexDirection: 'column',
    flexShrink: 1,
    justifyContent: 'space-around'
  },
  itemNbr: {
    fontSize: 12,
    color: COLOR.GREY_700,
    flexWrap: 'wrap',
    flexShrink: 1
  },
  itemNbrView: {
    paddingBottom: 10
  },
  itemDesc: {
    fontSize: 14,
    flexWrap: 'wrap',
    flexShrink: 1,
    marginVertical: 2
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    paddingVertical: 6,
    paddingHorizontal: 25,
    color: COLOR.GREY_700
  },
  contentList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  otherOHDetails: {
    backgroundColor: COLOR.WHITE
  },
  itemQtyView: {
    flexDirection: 'row'
  },
  itemQtyContainer: {
    flexDirection: 'column'
  },
  infoIcon: {
    paddingTop: 2,
    paddingRight: 6
  }
});

export default styles;
