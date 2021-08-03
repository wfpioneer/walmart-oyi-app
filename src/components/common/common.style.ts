import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK_TRANSPARENT_600
  },
  contentContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 7.5,
    paddingBottom: 12,
    paddingHorizontal: 8
  },
  textInput: {
    flex: 1,
    paddingLeft: 10
  }
});
