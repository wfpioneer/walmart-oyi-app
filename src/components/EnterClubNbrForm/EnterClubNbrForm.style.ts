import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 7.5,
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  textInput: {
    paddingLeft: 10
  },
  affirmButton: {
    width: '50%',
    paddingHorizontal: 12
  },
  cancelButton: {
    width: '50%',
    paddingHorizontal: 12
  },
  buttonRow: {
    flex: 0,
    flexDirection: 'row'
  }
});
