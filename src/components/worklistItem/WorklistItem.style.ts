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
  },
  pendingBadges: {
    flexDirection: 'row'
  },
  pendingPick: {
    backgroundColor: COLOR.GREY_300,
    marginRight: 10,
    marginVertical: 5,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 11,
    borderWidth: 1,
    borderColor: COLOR.GREY_200
  },
  pendingApproval: {
    backgroundColor: COLOR.PALE_ORANGE,
    marginVertical: 5,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 11,
    borderWidth: 1,
    borderColor: COLOR.GREY_200
  }
});
