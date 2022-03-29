import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: 45,
    alignContent: 'flex-start'
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLOR.GREY,
    marginHorizontal: 20,
    marginBottom: 10
  },
  locationText: {
    textAlign: 'center'
  },
  numericSelectorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 10
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  buttonContainer: {
    marginHorizontal: 20
  }
});

export default styles;
