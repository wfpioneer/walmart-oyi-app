import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 15
  },
  titleText: {
    fontSize: 18,
    width: '100%',
    fontWeight: 'bold',
    marginHorizontal: 5,
    paddingTop: 5,
    textAlign: 'center'
  },
  textField: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 4
  },
  button: {
    marginTop: 10,
    width: '100%'
  },
  alertView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10
  },
  errorText: {
    fontSize: 12,
    color: COLOR.RED_300,
    marginHorizontal: 5
  },
  completeActivityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
