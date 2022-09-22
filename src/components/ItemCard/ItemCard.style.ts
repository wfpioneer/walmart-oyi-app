import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    width: '100%',
    padding: 5,
    flexDirection: 'row'
  },
  loaderContainer: {
    backgroundColor: COLOR.GREY_TRANSPARENT,
    padding: 5,
    flexDirection: 'row'
  },
  image: {
    height: 85,
    width: 85
  },
  itemDetails: {
    padding: 5,
    flexDirection: 'column',
    flexShrink: 1
  },
  itemNbr: {
    fontSize: 12,
    color: COLOR.GREY_700,
    flexWrap: 'wrap',
    flexShrink: 1
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
  }
});

export default styles;
