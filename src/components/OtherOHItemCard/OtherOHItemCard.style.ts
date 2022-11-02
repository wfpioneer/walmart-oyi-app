import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  otherOHDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLOR.WHITE
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 8
  },
  content: {
    padding: 8,
    textAlign: 'right'
  },
  titleStyle: {
    fontWeight: '500',
    paddingLeft: 10
  },
  contentList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
});

export default styles;
