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
    justifyContent: 'center',
    paddingRight: 10
  },
  leftButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  image: {
    width: 25,
    height: 25,
    marginRight: 10
  }
});

export default styles;
