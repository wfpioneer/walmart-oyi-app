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
    flexDirection: 'row'
  },
  editedContainer: {
    alignItems: 'center',
    justifyContent,
    backgroundColor: COLOR.YELLOW,
    padding: 15,
    marginBottom: 2,
    flexDirection: 'row'
  },
  addedContainer: {
    alignItems: 'center',
    justifyContent,
    backgroundColor: COLOR.PALE_GREEN,
    padding: 15,
    marginBottom: 2,
    flexDirection: 'row'
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flex: 1,
    marginRight: 20
  },
  itemContainer: {
    paddingRight: 15
  },
  textHeader: {
    flex: 1
  },
  textHeaderRows: {
    flex: 1,
    fontSize: 10
  },
  itemHeader: {
    flexDirection: 'row'
  },
  delete: {
    justifyContent: 'center',
    paddingLeft: 180
  },
  itemHeaderFirstRow: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
    fontSize: 8
  },
  itemHeaderSecondRow: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 8,
    paddingTop: 5
  },
  numericSelectorView: {
    flexDirection: 'row',
    paddingTop: 10
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});
