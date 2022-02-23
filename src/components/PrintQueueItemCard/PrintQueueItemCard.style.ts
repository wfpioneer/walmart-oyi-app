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
    flex: 1
  },
  itemSize: {
    textAlign: 'right'
  },
  textHeaderRows: {
    flex: 1,
    fontSize: 10
  },
  itemHeaderFirstRow: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5
  }
});
