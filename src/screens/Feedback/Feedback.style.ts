import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

export default StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  rateContainer: {
    alignItems: 'center'
  },
  textAreaContainer: {
    borderColor: COLOR.GREY,
    borderWidth: 1,
    marginVertical: 20
  },
  textArea: {
    textAlignVertical: 'top'
  },
  buttonContainer: {
    paddingVertical: 20
  },
  safeAreaView: {
    flex: 1
  }
});
