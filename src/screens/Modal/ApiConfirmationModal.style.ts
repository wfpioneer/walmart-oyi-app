import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmationTextView: {
    flexDirection: 'column'
  },
  confirmationText: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },
  confirmationTextWithSubtext: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5
  },
  confirmationExtraText: {
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});

export default styles;
