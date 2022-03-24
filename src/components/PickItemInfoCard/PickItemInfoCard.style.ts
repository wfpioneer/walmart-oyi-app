import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLOR.TRAINING_BLUE,
    paddingBottom: 10
  },
  itemDescContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  itemDescText: {
    flex: 1,
    fontSize: 14
  },
  salesFloorContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    flex: 1,
    borderColor: COLOR.GREEN,
    borderEndWidth: 1
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
