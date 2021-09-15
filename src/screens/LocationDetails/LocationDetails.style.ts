import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  sectionLabel: {
    height: 70,
    width: '100%',
    backgroundColor: COLOR.GREY_300,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  labelText: {
    fontWeight: 'bold'
  },
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end'
  },
  button: {
    alignSelf: 'flex-end'
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row'
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },
  delButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});

export default styles;
