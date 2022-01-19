import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  scanContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 370
  },
  textInput: {
    paddingLeft: 10,
    color: COLOR.BLACK,
    borderWidth: 1
  },
  scanText: {
    paddingTop: 30
  },
  orText: {
    paddingTop: 20
  },
  textView: {
    width: 200,
    paddingTop: 20
  },
  palletContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  palletInfoHeader: {
    paddingHorizontal: 20,
    marginVertical: 20
  },
  palletText: {
    fontSize: 18
  },
  itemText: {
    fontSize: 14
  },
  mergeText: {
    alignSelf: 'center',
    fontSize: 16
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  }
});

export default styles;
