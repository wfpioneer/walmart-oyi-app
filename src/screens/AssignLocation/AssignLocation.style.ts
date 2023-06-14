import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  scanView: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
    padding: 5,
    width: '95%',
    borderTopColor: COLOR.GRAY,
    borderTopWidth: 1
  },
  scanText: {
    fontSize: 20
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 1,
    width: '100%'
  },
  // Warning Modal styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    height: 80,
    elevation: 10
  },
  buttonAlign: {
    alignSelf: 'center',
    width: '40%',
    margin: 10
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    padding: 15
  },
  labelHeader: {
    fontSize: 18,
    textAlign: 'center',
    color: COLOR.RED_500,
    paddingBottom: 5
  }
});

export default styles;
