import { StyleSheet } from "react-native";
import COLOR from "../../themes/Color";

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  list: {
    flex: 1,
    width: '100%'
  },
  viewSwitcher: {
    backgroundColor: COLOR.WHITE,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row'
  }
});