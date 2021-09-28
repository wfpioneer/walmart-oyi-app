import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
  },
  buttonViewContainer: {
    flex: 1,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconSize: {
    width: 25,
    height: 25
  },
  iconSizeRight: {
    width: 25,
    height: 25,
    marginRight: 10
  },
  titleText: {
    flex: 1,
    marginStart: 16
  }
});

export default styles;
