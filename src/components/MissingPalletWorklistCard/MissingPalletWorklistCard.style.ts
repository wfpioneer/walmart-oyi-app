import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLOR.PALE_BLUE,
    paddingBottom: 10,
    backgroundColor: COLOR.WHITE
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 7
  },
  wrapperContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    flex: 1
  },
  contentText: {
    fontSize: 12
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  exceptionType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.PINK
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 10
  },
  palletActionContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  arrowIcon: {
    flex: 1
  }
});

export default styles;
