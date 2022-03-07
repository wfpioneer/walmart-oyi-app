import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const justifyContent = 'flex-start';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent,
    backgroundColor: COLOR.WHITE,
    padding: 15,
    marginBottom: 2,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flex: 1,
    marginRight: 20
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textHeader: {
    flex: 1,
    fontSize: 16
  },
  itemSize: {
    textAlign: 'right'
  },
  textHeaderRows: {
    flex: 1,
    color: COLOR.GREY_800
  },
  itemHeaderFirstRow: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  icon: {
    paddingVertical: 5,
    paddingHorizontal: 5
  }
});
