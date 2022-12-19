import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: COLOR.WHITE,
    height: 100,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 2,
    flexDirection: 'row'
  },
  image: {
    marginRight: 15
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    height: 100,
    flex: 1
  },
  exceptionType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.PINK
  },
  itemInfo: {
    fontSize: 12
  },
  itemNumber: {
    fontSize: 12,
    color: COLOR.GREY_700
  }
});
