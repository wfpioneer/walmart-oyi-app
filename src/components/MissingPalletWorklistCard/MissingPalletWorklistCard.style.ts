import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
    borderColor: COLOR.PALE_BLUE,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLOR.WHITE
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  wrapperContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  contentText: {
    fontSize: 12,
    paddingVertical: 2
  },
  exceptionType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.PINK
  },
  actionButton: {
    flex: 1,
    fontSize: 12,
    paddingRight: 15
  },
  palletActionContainer: {
    alignContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5
  },
  iconView: {
    alignItems: 'flex-end'
  }
});

export default styles;
