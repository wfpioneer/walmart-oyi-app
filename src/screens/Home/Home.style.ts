import { StyleSheet } from 'react-native';
import {COLOR} from "../../themes/Color";

export default StyleSheet.create({
  activityIndicator: {
    marginTop: 10
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  pingGoogleButton: {
    marginTop: 20,
    width: '80%'
  },
  safeAreaView: {
    flex: 1
  },
  horizontalContainer: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLOR.WHITE,
    padding: 10,
    justifyContent: "space-between"
}
});
