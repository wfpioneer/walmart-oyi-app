import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly'
  },
  rightButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 15,
    height: 25,
    marginRight: 20
  },
  scanButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15
  }
});

export default styles;
