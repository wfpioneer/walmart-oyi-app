import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const SPACE_BETWEEN = 'space-between';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: SPACE_BETWEEN,
    borderWidth: 1,
    borderColor: COLOR.PALE_BLUE,
    paddingBottom: 10,
    backgroundColor: COLOR.WHITE
  },
  itemDescContainer: {
    flexDirection: 'row',
    justifyContent: SPACE_BETWEEN,
    paddingHorizontal: 7
  },
  itemDescText: {
    flex: 1,
    fontSize: 14
  },
  salesFloorContainer: {
    flexDirection: 'column',
    justifyContent: SPACE_BETWEEN,
    paddingHorizontal: 7,
    flex: 1
  },
  contentText: {
    fontSize: 12
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});

export default styles;
