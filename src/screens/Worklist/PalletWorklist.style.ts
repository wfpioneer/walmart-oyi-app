import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%'
  },
  list: {
    flex: 1,
    width: '100%'
  },
  message: {
    fontSize: 18,
    padding: 10,
    color: COLOR.WHITE
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  },
  delHeader: {
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    justifyContent: 'flex-start',
    width: '100%',
    borderBottomWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  delText: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 10
  }
});
