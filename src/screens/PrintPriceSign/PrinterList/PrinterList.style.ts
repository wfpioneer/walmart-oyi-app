import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

const flexStart = 'flex-start';
const center = 'center';

export default StyleSheet.create({
  flatList: {
    backgroundColor: COLOR.WHITE
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: center,
    justifyContent: flexStart,
    paddingHorizontal: 15,
    marginVertical: 10,
    height: 40
  },
  disabledCardContainer: {
    flexDirection: 'row',
    alignItems: center,
    justifyContent: flexStart,
    paddingHorizontal: 15,
    marginVertical: 10,
    height: 40,
    opacity: 0.5
  },
  printerDescription: {
    flex: 1,
    alignItems: flexStart,
    justifyContent: center,
    paddingHorizontal: 10
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 1,
    width: '100%'
  },
  trashCan: {
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 10
  }
});
