import { StyleSheet } from 'react-native';
import COLOR from "../themes/Color";

export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    flex: 1
  },
  rightButton: {
    flex: 1,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 25,
    height: 25,
    marginRight: 10
  },
  headerTitle: {
    color: COLOR.WHITE,
    fontWeight: 'bold',
    fontSize: 20
  },
  headerSubtitle: {
    color: COLOR.WHITE,
    fontSize: 14
  }
});
